import type {KanaAlphabet, KanaSet} from '@/entities/kana';
import {findKanaById, getKanaByAlphabetsAndSet} from '@/entities/kana';
import type {AnswerTimeLimit, SessionLimit, TrainingMode} from './types';
import {
    DEFAULT_SESSION_LIMIT,
    DEFAULT_TIME_LIMIT,
    DURATION_MAX,
    DURATION_MIN,
    REPETITION_MAX,
    REPETITION_MIN,
    TIME_LIMIT_CUSTOM_MAX,
    TIME_LIMIT_CUSTOM_MIN,
    TRAINING_MODES,
} from './types';

/**
 * Настройки подготовительного экрана тренажёра, сохранённые между запусками.
 */
export interface TrainerSettings {
    readonly alphabets: readonly KanaAlphabet[];
    readonly set: KanaSet;
    readonly symbolIds: readonly string[];
    readonly sessionLimit: SessionLimit;
    readonly mode: TrainingMode;
    readonly timeLimit: AnswerTimeLimit;
}

/** Ключ, под которым настройки тренажёра хранятся в localStorage. */
export const TRAINER_SETTINGS_STORAGE_KEY = 'aiueo.trainerSettings.v1';

const ALPHABETS: readonly string[] = ['hiragana', 'katakana'];
const SETS: readonly string[] = ['base', 'dakuon', 'yoon'];
const TIME_LIMIT_PRESETS: readonly string[] = ['easy', 'medium', 'hard'];

/** Зажимает целое число в диапазон [min, max]. */
function clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
}

/** Восстанавливает чистый лимит времени из грязной записи. */
function parseTimeLimit(raw: unknown): AnswerTimeLimit {
    if (typeof raw !== 'object' || raw === null) {
        return {kind: 'off'};
    }
    const rec = raw as Record<string, unknown>;
    if (rec.kind === 'preset' && TIME_LIMIT_PRESETS.includes(rec.preset as string)) {
        return {kind: 'preset', preset: rec.preset as 'easy' | 'medium' | 'hard'};
    }
    if (rec.kind === 'custom' && typeof rec.seconds === 'number' && Number.isFinite(rec.seconds)) {
        return {kind: 'custom', seconds: clamp(rec.seconds, TIME_LIMIT_CUSTOM_MIN, TIME_LIMIT_CUSTOM_MAX)};
    }
    return {kind: 'off'};
}

/** Восстанавливает чистое условие завершения из грязной записи. */
function parseSessionLimit(raw: unknown): SessionLimit {
    if (typeof raw !== 'object' || raw === null) {
        return {kind: 'repetitions', repetitions: REPETITION_MIN};
    }
    const rec = raw as Record<string, unknown>;
    if (rec.kind === 'time' && typeof rec.seconds === 'number' && Number.isFinite(rec.seconds)) {
        const seconds = clamp(rec.seconds, DURATION_MIN * 60, DURATION_MAX * 60);
        return {kind: 'time', seconds};
    }
    if (rec.kind === 'repetitions' && typeof rec.repetitions === 'number' && Number.isFinite(rec.repetitions)) {
        return {kind: 'repetitions', repetitions: clamp(rec.repetitions, REPETITION_MIN, REPETITION_MAX)};
    }
    return {kind: 'repetitions', repetitions: REPETITION_MIN};
}

/** Уточнение грязной записи из хранилища в чистые настройки; при ошибке — undefined. */
export function sanitizeTrainerSettings(raw: unknown): TrainerSettings | undefined {
    if (typeof raw !== 'object' || raw === null) {
        return undefined;
    }
    const rec = raw as Record<string, unknown>;

    const alphabets = (Array.isArray(rec.alphabets)
        ? rec.alphabets.filter((a): a is KanaAlphabet => ALPHABETS.includes(a as KanaAlphabet))
        : []
    ).slice(0, 2) as readonly KanaAlphabet[];
    if (alphabets.length === 0) {
        return undefined;
    }

    const set: KanaSet = SETS.includes(rec.set as string) ? (rec.set as KanaSet) : 'base';

    const symbolIds = Array.isArray(rec.symbolIds)
        ? rec.symbolIds.filter((id): id is string => typeof id === 'string' && Boolean(findKanaById(id)))
        : [];

    const mode: TrainingMode = (TRAINING_MODES as readonly string[]).includes(rec.mode as string)
        ? (rec.mode as TrainingMode)
        : 'typing';

    const sessionLimit = parseSessionLimit(rec.sessionLimit);
    const timeLimit = parseTimeLimit(rec.timeLimit);

    return {alphabets, set, symbolIds, sessionLimit, mode, timeLimit};
}

/** Читает настройки тренажёра из localStorage. При ошибке или отсутствии — undefined. */
export function loadTrainerSettings(): TrainerSettings | undefined {
    if (typeof window === 'undefined') {
        return undefined;
    }
    try {
        const raw = window.localStorage.getItem(TRAINER_SETTINGS_STORAGE_KEY);
        return raw ? sanitizeTrainerSettings(JSON.parse(raw)) : undefined;
    } catch {
        return undefined;
    }
}

/** Сохраняет настройки тренажёра в localStorage. Ошибки записи молча игнорируются. */
export function saveTrainerSettings(settings: TrainerSettings): void {
    if (typeof window === 'undefined') {
        return;
    }
    try {
        window.localStorage.setItem(TRAINER_SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch {
        // Хранилище может быть недоступно (например, в приватном режиме).
    }
}

/** Удаляет сохранённые настройки тренажёра из localStorage. */
export function clearTrainerSettings(): void {
    if (typeof window === 'undefined') {
        return;
    }
    try {
        window.localStorage.removeItem(TRAINER_SETTINGS_STORAGE_KEY);
    } catch {
        // Хранилище может быть недоступно (например, в приватном режиме).
    }
}

/** Дефолтные настройки экрана подготовки (сброс и значение по умолчанию). */
export function defaultTrainerSettings(): TrainerSettings {
    return {
        alphabets: ['hiragana'],
        set: 'base',
        symbolIds: getKanaByAlphabetsAndSet(['hiragana'], 'base').map((kana) => kana.id),
        sessionLimit: DEFAULT_SESSION_LIMIT,
        mode: 'typing',
        timeLimit: DEFAULT_TIME_LIMIT,
    };
}
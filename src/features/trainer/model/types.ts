import type {KanaSymbol} from '@/entities/kana';
import type {MessageKey} from '@/shared/lib/i18n';

/** Режимы упражнения, доступные в тренажёре. */
export type TrainingMode = 'typing' | 'choice' | 'mixed';

export const TRAINING_MODES: readonly TrainingMode[] = ['typing', 'choice', 'mixed'];

/**
 * Ключи сообщений интерфейса для подписей режимов тренировки.
 * Сами строки живут в словаре локализации (shared/lib/i18n).
 */
export const MODE_KEYS: Record<TrainingMode, MessageKey> = {
    typing: 'mode.typing',
    choice: 'mode.choice',
    mixed: 'mode.mixed',
} as const;

/** Состояние ответа пользователя по одному вопросу. */
export type AnswerStatus = 'pending' | 'correct' | 'incorrect' | 'timeout';

/** Вопрос тренажёра в режиме «написать ромадзи». */
export interface TypingQuestion {
    readonly kind: 'typing';
    readonly id: string;
    readonly prompt: KanaSymbol;
}

/** Вопрос тренажёра в режиме «выбрать знак» (даётся чтение, на выбор — знаки). */
export interface ChoiceQuestion {
    readonly kind: 'choice';
    readonly id: string;
    readonly promptRomaji: string;
    readonly options: readonly KanaSymbol[];
    readonly correct: KanaSymbol;
}

/** Любой вопрос тренажёра. */
export type TrainingQuestion = TypingQuestion | ChoiceQuestion;

/** Результат прохождения одного вопроса. */
export interface QuestionResult {
    readonly question: TrainingQuestion;
    readonly status: AnswerStatus;
    /** Ответ пользователя (ромадзи или id выбранного знака). */
    readonly submitted: string;
    readonly correctAnswer: string;
    /** Время, потраченное на вопрос, в миллисекундах. */
    readonly durationMs: number;
}

/** Числовые значения по умолчанию для настроек. */
export const DEFAULT_REPETITIONS = 10;
export const REPETITION_MIN = 1;
export const REPETITION_MAX = 50;

/** Готовые пресеты времени на один вопрос. */
export type TimeLimitPreset = 'easy' | 'medium' | 'hard';

/**
 * Настройка лимита времени на ответ:
 * «off» — без ограничения, «preset» — готовый пресет, «custom» — свой в секундах.
 */
export type AnswerTimeLimit =
    | {readonly kind: 'off'}
    | {readonly kind: 'preset'; readonly preset: TimeLimitPreset}
    | {readonly kind: 'custom'; readonly seconds: number};

/** Варианты лимита на экране настройки (без значений секунд). */
export type TimeLimitOption = 'off' | TimeLimitPreset | 'custom';

/** Порядок вариантов лимита на экране настройки. */
export const TIME_LIMIT_OPTIONS: readonly TimeLimitOption[] = [
    'off',
    'easy',
    'medium',
    'hard',
    'custom',
];

/** Секунды по умолчанию для пользовательского лимита. */
export const TIME_LIMIT_CUSTOM_DEFAULT = 60;
export const TIME_LIMIT_CUSTOM_MIN = 1;
export const TIME_LIMIT_CUSTOM_MAX = 600;

/** Секунды для готовых пресетов: лёгкий — 30 сек, средний — 10 сек, сложный — 2 сек. */
export const TIME_LIMIT_PRESET_SECONDS: Record<TimeLimitPreset, number> = {
    easy: 30,
    medium: 10,
    hard: 2,
} as const;

/** Лимит по умолчанию — без ограничения времени. */
export const DEFAULT_TIME_LIMIT: AnswerTimeLimit = {kind: 'off'};

/** Ключи i18n для подписей вариантов лимита времени. */
export const TIME_LIMIT_KEYS: Record<TimeLimitOption, MessageKey> = {
    off: 'timeLimit.off',
    easy: 'timeLimit.easy',
    medium: 'timeLimit.medium',
    hard: 'timeLimit.hard',
    custom: 'timeLimit.custom',
} as const;

/** Вычисляет выбранный вариант сегментного переключателя из текущего лимита. */
export function timeLimitToOption(limit: AnswerTimeLimit): TimeLimitOption {
    if (limit.kind === 'off') {
        return 'off';
    }
    if (limit.kind === 'custom') {
        return 'custom';
    }
    return limit.preset;
}

/** Строит значение лимита по выбранному варианту и секундам пользовательского лимита. */
export function timeLimitFromOption(
    option: TimeLimitOption,
    customSeconds: number,
): AnswerTimeLimit {
    if (option === 'off') {
        return {kind: 'off'};
    }
    if (option === 'custom') {
        return {kind: 'custom', seconds: customSeconds};
    }
    return {kind: 'preset', preset: option};
}
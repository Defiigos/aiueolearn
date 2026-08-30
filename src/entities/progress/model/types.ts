/**
 * Прогресс изучения по отдельным знакам.
 * Хранится на клиенте (localStorage) и легко переносится на сервер в будущем.
 */

/** Накопленная статистика по одному знаку. */
export interface SymbolProgress {
    readonly id: string;
    /** Сколько раз пользователь отвечал на этот знак. */
    readonly attempts: number;
    /** Сколько раз отвечал верно. */
    readonly correct: number;
}

/** Словарь прогресса по всем известным знакам (ключ — id знака). */
export type ProgressMap = Record<string, SymbolProgress>;

/** Ключ, под которым прогресс хранится в localStorage. */
export const PROGRESS_STORAGE_KEY = 'aiueo.progress.v1';

/** Уровень освоения знака, производный от статистики. */
export type MasteryLevel = 'new' | 'learning' | 'practiced' | 'mastered';

/** Уточнение грязной записи из хранилища в чистый объект прогресса. */
export function sanitizeProgress(raw: unknown): ProgressMap {
    if (typeof raw !== 'object' || raw === null) {
        return {};
    }
    const result: ProgressMap = {};
    for (const [key, value] of Object.entries(raw)) {
        if (
            typeof value === 'object' &&
            value !== null &&
            typeof (value as SymbolProgress).id === 'string' &&
            typeof (value as SymbolProgress).attempts === 'number' &&
            typeof (value as SymbolProgress).correct === 'number'
        ) {
            result[key] = {
                id: (value as SymbolProgress).id,
                attempts: (value as SymbolProgress).attempts,
                correct: (value as SymbolProgress).correct,
            };
        }
    }
    return result;
}
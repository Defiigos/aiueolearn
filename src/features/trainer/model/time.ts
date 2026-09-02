import {TIME_LIMIT_PRESET_SECONDS, type AnswerTimeLimit} from './types';

/** Секунды активного лимита времени на вопрос, либо `undefined` при его отсутствии. */
export function limitToSeconds(limit: AnswerTimeLimit): number | undefined {
    if (limit.kind === 'off') {
        return undefined;
    }
    if (limit.kind === 'custom') {
        return limit.seconds;
    }
    return TIME_LIMIT_PRESET_SECONDS[limit.preset];
}

/**
 * Форматирует длительность в секундах как «м:сс» (минуты без обнуляющего префикса).
 * Отрицательные значения округляются до нуля.
 */
export function formatDuration(totalSeconds: number): string {
    const s = Math.max(0, Math.round(totalSeconds));
    const minutes = Math.floor(s / 60);
    const seconds = s % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
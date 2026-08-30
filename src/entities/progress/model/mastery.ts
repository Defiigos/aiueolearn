import type {MasteryLevel, SymbolProgress} from './types';

/**
 * Вычисляет уровень освоения знака по накопленной статистике.
 * Неизвестный/нулевой знак считается новым.
 */
export function getMasteryLevel(progress: SymbolProgress | undefined): MasteryLevel {
    if (!progress || progress.attempts === 0) {
        return 'new';
    }
    const ratio = progress.correct / progress.attempts;
    if (progress.attempts >= 5 && ratio >= 0.8) {
        return 'mastered';
    }
    if (progress.attempts >= 2) {
        return 'practiced';
    }
    return 'learning';
}
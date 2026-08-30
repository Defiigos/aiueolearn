/**
 * Возвращает псевдослучайное целое число в [min, max] включительно.
 */
export function randomInt(min: number, max: number): number {
    const normalizedMin = Math.ceil(min);
    const normalizedMax = Math.floor(max);
    return Math.floor(Math.random() * (normalizedMax - normalizedMin + 1)) + normalizedMin;
}

/** Перемешивает копию массива (фишер-ейтс). */
export function shuffle<T>(items: readonly T[]): T[] {
    const result = [...items];
    for (let i = result.length - 1; i > 0; i--) {
        const j = randomInt(0, i);
        const a = result[i];
        const b = result[j];
        if (a !== undefined && b !== undefined) {
            result[i] = b;
            result[j] = a;
        }
    }
    return result;
}
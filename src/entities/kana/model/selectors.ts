import {ALL_KANA, KANA_CATALOG} from './data';
import type {KanaAlphabet, KanaColumn, KanaSet, KanaSymbol} from './types';
import {COLUMN_ORDER, SET_ORDER} from './types';

/** Возвращает все знаки конкретного набора одной азбуки. */
export function getKanaBySet(alphabet: KanaAlphabet, set: KanaSet): readonly KanaSymbol[] {
    return KANA_CATALOG[alphabet][set];
}

/** Возвращает знаки набора для нескольких азбук (порядок азбук сохраняется). */
export function getKanaByAlphabetsAndSet(
    alphabets: readonly KanaAlphabet[],
    set: KanaSet,
): readonly KanaSymbol[] {
    return alphabets.flatMap((alphabet) => getKanaBySet(alphabet, set));
}

/** Возвращает все знаки (все наборы) для выбранных азбук в порядке базовый→ёон. */
export function getAllKanaByAlphabets(
    alphabets: readonly KanaAlphabet[],
): readonly KanaSymbol[] {
    return alphabets.flatMap((alphabet) =>
        SET_ORDER.flatMap((set) => getKanaBySet(alphabet, set)),
    );
}

/** Ищет знак по идентификатору во всём каталоге. */
export function findKanaById(id: string): KanaSymbol | undefined {
    return ALL_KANA.find((kana) => kana.id === id);
}

/** Строит список колонок, реально присутствующих в наборе (у ёона их три). */
export function columnsForSet(
    alphabet: KanaAlphabet,
    set: KanaSet,
): readonly KanaColumn[] {
    const present = new Set<KanaColumn>();
    for (const symbol of getKanaBySet(alphabet, set)) {
        if (symbol.column) {
            present.add(symbol.column);
        }
    }
    return COLUMN_ORDER.filter((column) => present.has(column));
}
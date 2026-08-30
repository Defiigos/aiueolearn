import type {MessageKey} from '@/shared/lib/i18n';

/** Азбука, к которой принадлежит знак. */
export type KanaAlphabet = 'hiragana' | 'katakana';

/**
 * Ключи сообщений интерфейса для названий азбук.
 * Сами строки живут в словаре локализации (shared/lib/i18n).
 */
export const ALPHABET_KEYS: Record<KanaAlphabet, MessageKey> = {
    hiragana: 'alphabet.hiragana',
    katakana: 'alphabet.katakana',
} as const;

/**
 * Набор (категория) знаков внутри азбуки:
 * - `base` — базовый годзюон;
 * - `dakuon` — озвончённые (дакуон) и хандакуон (серия с точкой pa);
 * - `yoon` — сочетания с малыми ゃ/ゅ/ょ (включая озвончённые ёоны).
 */
export type KanaSet = 'base' | 'dakuon' | 'yoon';

/**
 * Ключи сообщений интерфейса для подписей наборов знаков.
 * Сами строки живут в словаре локализации (shared/lib/i18n).
 */
export const SET_KEYS: Record<KanaSet, MessageKey> = {
    base: 'set.base',
    dakuon: 'set.dakuon',
    yoon: 'set.yoon',
} as const;

/** Порядок наборов знаков. */
export const SET_ORDER: readonly KanaSet[] = ['base', 'dakuon', 'yoon'];

/** Порядок строк годзюона для каждого набора. */
export const ROW_ORDER: Record<KanaSet, readonly KanaRow[]> = {
    base: ['vowels', 'k', 's', 't', 'n', 'h', 'm', 'y', 'r', 'w'],
    dakuon: ['g', 'z', 'd', 'b', 'p'],
    yoon: ['ky', 'sh', 'ch', 'ny', 'hy', 'my', 'ry', 'gy', 'j', 'by', 'py'],
};

/** Колонка годзюона (гласный знак ряда). `null` — знак вне таблицы (например ん). */
export type KanaColumn = 'a' | 'i' | 'u' | 'e' | 'o';

/** Подписи колонок. */
export const COLUMN_LABELS: Record<KanaColumn, string> = {
    a: 'a',
    i: 'i',
    u: 'u',
    e: 'e',
    o: 'o',
} as const;

/** Порядок колонок годзюона. */
export const COLUMN_ORDER: readonly KanaColumn[] = ['a', 'i', 'u', 'e', 'o'];

/**
 * Строка годзюона (группа знаков с одинаковой согласной), включая
 * строки озвончённых и ёонов.
 */
export type KanaRow =
// Базовые
    | 'vowels'
    | 'k'
    | 's'
    | 't'
    | 'n'
    | 'h'
    | 'm'
    | 'y'
    | 'r'
    | 'w'
    // Дакуон / хандакуон
    | 'g'
    | 'z'
    | 'd'
    | 'b'
    | 'p'
    // Ёон
    | 'ky'
    | 'sh'
    | 'ch'
    | 'ny'
    | 'hy'
    | 'my'
    | 'ry'
    | 'gy'
    | 'j'
    | 'by'
    | 'py';

/** Короткие подписи строк годзюона. */
export const ROW_LABELS: Record<KanaRow, string> = {
    // Базовые
    vowels: 'А',
    k: 'K',
    s: 'S',
    t: 'T',
    n: 'N',
    h: 'H',
    m: 'M',
    y: 'Y',
    r: 'R',
    w: 'W',
    // Дакуон / хандакуон
    g: 'G',
    z: 'Z',
    d: 'D',
    b: 'B',
    p: 'P',
    // Ёон
    ky: 'K',
    sh: 'S',
    ch: 'T',
    ny: 'N',
    hy: 'H',
    my: 'M',
    ry: 'R',
    gy: 'G',
    j: 'J',
    by: 'B',
    py: 'P',
} as const;

/**
 * Единичный знак азбуки.
 * `id` — стабильный идентификатор, `symbol` — глиф, `romaji` — чтение латиницей,
 * `ru` — русская транскрипция (приблизительное произношение).
 * `row`/`column` — позиция в таблице годзюона для выбора строк/колонок.
 */
export interface KanaSymbol {
    readonly id: string;
    readonly symbol: string;
    readonly romaji: string;
    readonly ru: string;
    readonly alphabet: KanaAlphabet;
    readonly set: KanaSet;
    readonly row: KanaRow;
    readonly column: KanaColumn | null;
}
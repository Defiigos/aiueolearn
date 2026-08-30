import {describe, expect, it} from 'vitest';
import {columnsForSet, getKanaBySet, KANA_CATALOG,} from '@/entities/kana';

describe('русские чтения', () => {
    it('каждый знак имеет непустое русское чтение, отличное от ромадзи', () => {
        for (const alphabet of ['hiragana', 'katakana'] as const) {
            for (const set of ['base', 'dakuon', 'yoon'] as const) {
                for (const symbol of KANA_CATALOG[alphabet][set]) {
                    expect(symbol.ru.length, symbol.symbol).toBeGreaterThan(0);
                    expect(symbol.ru, symbol.symbol).not.toBe(symbol.romaji);
                }
            }
        }
    });

    it('базовый か читается как «ка», ёон きゃ как «кя»', () => {
        const ka = getKanaBySet('hiragana', 'base').find((s) => s.symbol === 'か');
        const kya = getKanaBySet('hiragana', 'yoon').find((s) => s.symbol === 'きゃ');
        expect(ka?.ru).toBe('ка');
        expect(kya?.ru).toBe('кя');
    });
});

describe('columnsForSet', () => {
    it('базовый набор использует все пять колонок', () => {
        expect(columnsForSet('hiragana', 'base')).toEqual(['a', 'i', 'u', 'e', 'o']);
    });

    it('ёон использует только три колонки (a, u, o)', () => {
        expect(columnsForSet('hiragana', 'yoon')).toEqual(['a', 'u', 'o']);
    });
});

describe('размеры наборов', () => {
    it('обе азбуки имеют одинаковое число знаков в каждом наборе', () => {
        for (const set of ['base', 'dakuon', 'yoon'] as const) {
            expect(KANA_CATALOG.hiragana[set].length).toBe(KANA_CATALOG.katakana[set].length);
        }
        expect(KANA_CATALOG.hiragana.base).toHaveLength(46);
        expect(KANA_CATALOG.hiragana.dakuon).toHaveLength(25);
        expect(KANA_CATALOG.hiragana.yoon).toHaveLength(33);
    });
});
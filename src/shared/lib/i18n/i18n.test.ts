import {describe, expect, it} from 'vitest';
import {getInitialLocale, LOCALES} from './locale';
import type {MessageKey} from './messages';
import {messages, pluralRu} from './messages';
import {translate} from './translate';

/** Все ключи словаря, чтобы прогнать по ним проверки. */
const ALL_KEYS = Object.keys(messages.en) as MessageKey[];

describe('messages', () => {
    it('ru and en define exactly the same keys', () => {
        expect(Object.keys(messages.ru).sort()).toEqual(Object.keys(messages.en).sort());
        expect(ALL_KEYS.length).toBeGreaterThan(0);
    });

    it('every key maps to a non-empty string in both languages', () => {
        for (const key of ALL_KEYS) {
            expect(messages.ru[key].length).toBeGreaterThan(0);
            expect(messages.en[key].length).toBeGreaterThan(0);
        }
    });

    it('declares the same locales that have a dictionary', () => {
        expect(LOCALES.map((locale) => locale in messages)).toEqual([true, true]);
    });
});

describe('translate', () => {
    it('selects the language and leaves plain messages untouched', () => {
        expect(translate('ru', 'nav.trainer')).toBe('Тренажёр');
        expect(translate('en', 'nav.trainer')).toBe('Trainer');
    });

    it('substitutes numeric placeholders', () => {
        expect(translate('en', 'session.step', {current: 2, total: 10})).toBe('Step 2 of 10');
        expect(translate('ru', 'session.step', {current: 2, total: 10})).toBe('Шаг 2 из 10');
    });

    it('keeps the placeholder when its parameter is missing', () => {
        expect(translate('en', 'feedback.detail', {submitted: 'a'})).toBe(
            'Your answer: a · Correct: {correct}',
        );
    });
});

describe('pluralRu', () => {
    it('picks the correct form for Russian count nouns', () => {
        const word = (n: number): string => pluralRu(n, 'знак', 'знака', 'знаков');
        expect(word(1)).toBe('знак');
        expect(word(2)).toBe('знака');
        expect(word(4)).toBe('знака');
        expect(word(5)).toBe('знаков');
        expect(word(11)).toBe('знаков');
        expect(word(21)).toBe('знак');
        expect(word(22)).toBe('знака');
        expect(word(100)).toBe('знаков');
        expect(word(0)).toBe('знаков');
    });
});

describe('getInitialLocale', () => {
    it('falls back to the default locale when no window exists', () => {
        expect(getInitialLocale()).toBe('ru');
    });
});
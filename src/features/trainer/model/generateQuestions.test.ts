import {describe, expect, it} from 'vitest';
import {getKanaByAlphabetsAndSet, getKanaBySet} from '@/entities/kana';
import {generateQuestions} from '@/features/trainer/model/generateQuestions';

describe('getKanaBySet / getKanaByAlphabetsAndSet', () => {
    it('возвращает знаки только выбранного набора', () => {
        const base = getKanaBySet('hiragana', 'base');
        expect(base.every((kana) => kana.alphabet === 'hiragana')).toBe(true);
        expect(base.length).toBe(46);
    });

    it('возвращает знаки озвончённого набора', () => {
        const dakuon = getKanaBySet('hiragana', 'dakuon');
        expect(dakuon.length).toBe(25);
        expect(dakuon.every((kana) => kana.set === 'dakuon')).toBe(true);
    });

    it('объединяет азбуки при выборе обеих', () => {
        const both = getKanaByAlphabetsAndSet(['hiragana', 'katakana'], 'base');
        expect(both.length).toBe(46 * 2);
    });
});

describe('generateQuestions', () => {
    it('генерирует symbols * repetitions вопросов в режиме typing', () => {
        const symbols = getKanaBySet('hiragana', 'base').slice(0, 5);
        const questions = generateQuestions(symbols, 3, 'typing');
        expect(questions).toHaveLength(5 * 3);
        expect(questions.every((q) => q.kind === 'typing')).toBe(true);
    });

    it('для каждого вопроса choice даёт ровно 4 варианта и правильный ответ внутри', () => {
        const symbols = getKanaBySet('hiragana', 'base').slice(0, 6);
        const questions = generateQuestions(symbols, 2, 'choice');
        for (const q of questions) {
            if (q.kind !== 'choice') continue;
            expect(q.options).toHaveLength(4);
            expect(q.options.some((o) => o.id === q.correct.id)).toBe(true);
            expect(q.promptRomaji).toBe(q.correct.romaji);
        }
    });

    it('возвращает пустой список при отсутствии знаков', () => {
        expect(generateQuestions([], 5, 'typing')).toHaveLength(0);
    });

    it('в смешанном режиме генерирует вопросы обоих типов', () => {
        const symbols = getKanaBySet('hiragana', 'base').slice(0, 10);
        const questions = generateQuestions(symbols, 5, 'mixed');
        expect(questions).toHaveLength(10 * 5);
        const kinds = new Set(questions.map((q) => q.kind));
        expect(kinds.has('typing')).toBe(true);
        expect(kinds.has('choice')).toBe(true);
    });
});
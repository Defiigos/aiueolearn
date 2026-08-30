import {describe, expect, it} from 'vitest';
import {getMasteryLevel} from '@/entities/progress/model/mastery';
import type {SymbolProgress} from '@/entities/progress/model/types';
import {sanitizeProgress} from '@/entities/progress/model/types';

describe('getMasteryLevel', () => {
    it('неизвестный знак — новый', () => {
        expect(getMasteryLevel(undefined)).toBe('new');
    });

    it('нулевая активность — новый', () => {
        const p: SymbolProgress = {id: 'a', attempts: 0, correct: 0};
        expect(getMasteryLevel(p)).toBe('new');
    });

    it('небольшой опыт — learning', () => {
        const p: SymbolProgress = {id: 'a', attempts: 1, correct: 1};
        expect(getMasteryLevel(p)).toBe('learning');
    });

    it('2+ попыток — practiced', () => {
        const p: SymbolProgress = {id: 'a', attempts: 3, correct: 2};
        expect(getMasteryLevel(p)).toBe('practiced');
    });

    it('5+ попыток и высокая точность — mastered', () => {
        const p: SymbolProgress = {id: 'a', attempts: 6, correct: 5};
        expect(getMasteryLevel(p)).toBe('mastered');
    });

    it('5+ попыток, но низкая точность — не mastered', () => {
        const p: SymbolProgress = {id: 'a', attempts: 6, correct: 4};
        expect(getMasteryLevel(p)).not.toBe('mastered');
    });
});

describe('sanitizeProgress', () => {
    it('отбрасывает мусорные записи и оставляет валидные', () => {
        const raw = {
            good: {id: 'good', attempts: 2, correct: 1},
            badType: 'nope',
            missingField: {id: 'x', attempts: 1},
            nullEntry: null,
            wrongTypes: {id: 'y', attempts: 'a', correct: 1},
        };
        const result = sanitizeProgress(raw);
        expect(Object.keys(result)).toEqual(['good']);
        expect(result.good).toEqual({id: 'good', attempts: 2, correct: 1});
    });

    it('возвращает пустую карту для не-объекта', () => {
        expect(sanitizeProgress(null)).toEqual({});
        expect(sanitizeProgress('x')).toEqual({});
    });
});
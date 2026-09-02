import {describe, expect, it} from 'vitest';
import {formatDuration, limitToSeconds} from './time';

describe('limitToSeconds', () => {
    it('возвращает undefined для выключенного лимита', () => {
        expect(limitToSeconds({kind: 'off'})).toBeUndefined();
    });

    it('возвращает секунды готовых пресетов', () => {
        expect(limitToSeconds({kind: 'preset', preset: 'easy'})).toBe(30);
        expect(limitToSeconds({kind: 'preset', preset: 'medium'})).toBe(10);
        expect(limitToSeconds({kind: 'preset', preset: 'hard'})).toBe(2);
    });

    it('возвращает пользовательские секунды', () => {
        expect(limitToSeconds({kind: 'custom', seconds: 45})).toBe(45);
    });
});

describe('formatDuration', () => {
    it('форматирует секунды как «м:сс»', () => {
        expect(formatDuration(0)).toBe('0:00');
        expect(formatDuration(3)).toBe('0:03');
        expect(formatDuration(65)).toBe('1:05');
        expect(formatDuration(125)).toBe('2:05');
    });

    it('округляет дробные секунды', () => {
        expect(formatDuration(3.6)).toBe('0:04');
    });

    it('не даёт отрицательных значений', () => {
        expect(formatDuration(-5)).toBe('0:00');
    });
});
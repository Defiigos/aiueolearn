import {describe, expect, it} from 'vitest';
import {sanitizeTrainerSettings} from './trainerSettingsStorage';

describe('sanitizeTrainerSettings', () => {
    it('возвращает undefined для не-объекта', () => {
        expect(sanitizeTrainerSettings(null)).toBeUndefined();
        expect(sanitizeTrainerSettings('x')).toBeUndefined();
        expect(sanitizeTrainerSettings([])).toBeUndefined();
    });

    it('возвращает undefined при пустом списке азбук', () => {
        expect(sanitizeTrainerSettings({alphabets: []})).toBeUndefined();
        expect(sanitizeTrainerSettings({alphabets: ['nope']})).toBeUndefined();
    });

    it('восстанавливает валидные настройки как есть', () => {
        const raw = {
            alphabets: ['hiragana', 'katakana'],
            set: 'dakuon',
            symbolIds: ['hiragana_base_あ', 'hiragana_base_か', 'hiragana_dakuon_が'],
            sessionLimit: {kind: 'repetitions', repetitions: 25},
            mode: 'choice',
            timeLimit: {kind: 'preset', preset: 'medium'},
        };
        expect(sanitizeTrainerSettings(raw)).toEqual(raw);
    });

    it('зажимает повторения и длительность в допустимые границы', () => {
        expect(
            sanitizeTrainerSettings({
                alphabets: ['hiragana'],
                sessionLimit: {kind: 'repetitions', repetitions: 9999},
            }),
        ).toMatchObject({sessionLimit: {kind: 'repetitions', repetitions: 50}});

        expect(
            sanitizeTrainerSettings({
                alphabets: ['hiragana'],
                sessionLimit: {kind: 'time', seconds: 5},
            }),
        ).toMatchObject({sessionLimit: {kind: 'time', seconds: 60}});
    });

    it('заменяет неизвестный режим на typing, а неизвестный набор — на base', () => {
        const result = sanitizeTrainerSettings({
            alphabets: ['hiragana'],
            mode: 'bogus',
            set: 'bogus',
        });
        expect(result?.mode).toBe('typing');
        expect(result?.set).toBe('base');
    });

    it('отбрасывает несуществующие id знаков из выборки', () => {
        const result = sanitizeTrainerSettings({
            alphabets: ['hiragana'],
            symbolIds: ['hiragana_base_あ', 'не-знак', 'hiragana_base_か'],
        });
        expect(result?.symbolIds).toEqual(['hiragana_base_あ', 'hiragana_base_か']);
    });

    it('заменяет неизвестный пресет лимита на «без ограничения»', () => {
        const result = sanitizeTrainerSettings({
            alphabets: ['hiragana'],
            timeLimit: {kind: 'preset', preset: 'bogus'},
        });
        expect(result?.timeLimit).toEqual({kind: 'off'});
    });

    it('зажимает пользовательский лимит времени в границы', () => {
        const result = sanitizeTrainerSettings({
            alphabets: ['hiragana'],
            timeLimit: {kind: 'custom', seconds: 99999},
        });
        expect(result?.timeLimit).toEqual({kind: 'custom', seconds: 600});
    });
});
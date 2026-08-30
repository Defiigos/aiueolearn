import {createContext, useContext} from 'react';
import type {MessageKey} from './messages';
import type {TranslateParams} from './translate';
import type {Locale} from './types';

/** Доступ к языку интерфейса и функции перевода. */
export interface I18nContextValue {
    readonly locale: Locale;
    readonly setLocale: (locale: Locale) => void;
    readonly toggleLocale: () => void;
    /** Возвращает строку по ключу в текущем языке (с подстановкой плейсхолдеров). */
    readonly t: (key: MessageKey, params?: TranslateParams) => string;
}

export const I18nContext = createContext<I18nContextValue | null>(null);

/** Хук доступа к текущему языку и переводу строк. */
export function useI18n(): I18nContextValue {
    const context = useContext(I18nContext);
    if (!context) {
        throw new Error('useI18n must be used within an I18nProvider');
    }
    return context;
}
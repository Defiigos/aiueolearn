import type {Locale} from './types';
import {DEFAULT_LOCALE, LOCALE_STORAGE_KEY} from './types';

/** Все поддерживаемые языки. */
export const LOCALES: readonly Locale[] = ['ru', 'en'] as const;

/** Нативные подписи языков (не зависят от текущего языка интерфейса). */
export const LOCALE_OPTIONS: ReadonlyArray<{
    readonly value: Locale;
    readonly label: string;
}> = [
    {value: 'ru', label: 'Русский'},
    {value: 'en', label: 'English'},
];

/** Узкая проверка на поддерживаемый язык. */
export function isLocale(value: unknown): value is Locale {
    return typeof value === 'string' && (LOCALES as readonly string[]).includes(value);
}

/** Возвращает язык, на который переключается кнопка (противоположный текущему). */
export function otherLocale(locale: Locale): Locale {
    return locale === 'ru' ? 'en' : 'ru';
}

/** Возвращает язык из сохранённого значения, иначе системный; при отсутствии поддержки — основной. */
export function getInitialLocale(): Locale {
    if (typeof window === 'undefined') {
        return DEFAULT_LOCALE;
    }
    const saved = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    if (isLocale(saved)) {
        return saved;
    }
    const system = window.navigator?.language?.toLowerCase() ?? '';
    if (system.startsWith('en')) {
        return 'en';
    }
    return DEFAULT_LOCALE;
}
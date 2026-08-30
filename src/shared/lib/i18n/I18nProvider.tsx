import type {ReactNode} from 'react';
import {useCallback, useEffect, useMemo, useState} from 'react';
import type {I18nContextValue} from '@/shared/lib';
import {I18nContext} from './I18nContext';
import {getInitialLocale, otherLocale} from './locale';
import {translate} from './translate';
import type {Locale} from './types';
import {LOCALE_STORAGE_KEY} from './types';

interface I18nProviderProps {
    readonly children: ReactNode;
}

/** Провайдер локализации: применяет `lang` к документу и сохраняет выбор языка. */
export function I18nProvider({children}: I18nProviderProps): ReactNode {
    const [locale, setLocale] = useState<Locale>(getInitialLocale);

    useEffect(() => {
        document.documentElement.lang = locale;
        window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    }, [locale]);

    const toggleLocale = useCallback(() => {
        setLocale((current) => otherLocale(current));
    }, []);

    const value = useMemo<I18nContextValue>(
        () => ({
            locale,
            setLocale,
            toggleLocale,
            t: (key, params) => translate(locale, key, params),
        }),
        [locale, toggleLocale],
    );

    return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
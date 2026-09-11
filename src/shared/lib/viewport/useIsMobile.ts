import {useEffect, useState} from 'react';

/** Медиа-запрос мобильного брейкпоинта (тот же 40rem, что и в CSS). */
const MOBILE_QUERY = '(max-width: 40rem)';
/** Запасной порог в пикселях, если matchMedia недоступен. */
const MOBILE_FALLBACK_PX = 640;

interface MatchMediaResult {
    readonly matches: boolean;
}

/**
 * Возвращает true на мобильном экране. Совпадает с CSS-брейкпоинтом
 * `@media (max-width: 40rem)`: использует `window.matchMedia` для стартового
 * значения (как theme.ts) и слушает изменения размера окна как откат.
 */
export function useIsMobile(): boolean {
    const [isMobile, setIsMobile] = useState<boolean>(() => {
        if (typeof window === 'undefined') {
            return false;
        }
        if (typeof window.matchMedia === 'function') {
            try {
                return (window.matchMedia(MOBILE_QUERY) as MatchMediaResult).matches;
            } catch {
                // Проваливаемся на порог по ширине.
            }
        }
        return window.innerWidth <= MOBILE_FALLBACK_PX;
    });

    useEffect(() => {
        const update = (): void => {
            let next: boolean;
            if (typeof window.matchMedia === 'function') {
                try {
                    next = (window.matchMedia(MOBILE_QUERY) as MatchMediaResult).matches;
                } catch {
                    next = window.innerWidth <= MOBILE_FALLBACK_PX;
                }
            } else {
                next = window.innerWidth <= MOBILE_FALLBACK_PX;
            }
            setIsMobile(next);
        };
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, []);

    return isMobile;
}
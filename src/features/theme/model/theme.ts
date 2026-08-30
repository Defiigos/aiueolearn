/**
 * Тип применяемой темы и вспомогательные константы.
 * Базовой темой выступает светлая; тёмная задаётся через атрибут data-theme.
 */
export type Theme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'aiueo.theme';
export const THEME_ATTR = 'data-theme';

/** Возвращает тему из сохранённого значения либо системную по умолчанию. */
export function getInitialTheme(): Theme {
    if (typeof window === 'undefined') {
        return 'light';
    }
    const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') {
        return saved;
    }
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/** Применяет тему к корневому элементу документа. */
export function applyThemeToDocument(theme: Theme): void {
    const root = document.documentElement;
    if (theme === 'dark') {
        root.setAttribute(THEME_ATTR, 'dark');
    } else {
        root.removeAttribute(THEME_ATTR);
    }
}
import type {ReactNode} from 'react';
import {useEffect, useState} from 'react';
import type {Theme} from './theme';
import {applyThemeToDocument, getInitialTheme, THEME_STORAGE_KEY} from './theme';
import {ThemeContext} from './ThemeContext';

interface ThemeProviderProps {
    readonly children: ReactNode;
}

/** Провайдер темы: применяет тему к документу и сохраняет выбор пользователя. */
export function ThemeProvider({children}: ThemeProviderProps): ReactNode {
    const [theme, setTheme] = useState<Theme>(getInitialTheme);

    useEffect(() => {
        applyThemeToDocument(theme);
        window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    }, [theme]);

    const toggleTheme = (): void => {
        setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
    };

    return (
        <ThemeContext.Provider value={{theme, toggleTheme, setTheme}}>
            {children}
        </ThemeContext.Provider>
    );
}
import type {Dispatch, SetStateAction} from 'react';
import {createContext, useContext} from 'react';
import type {Theme} from './theme';

export interface ThemeContextValue {
    readonly theme: Theme;
    readonly toggleTheme: () => void;
    readonly setTheme: Dispatch<SetStateAction<Theme>>;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useThemeContext(): ThemeContextValue {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
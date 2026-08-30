import type {ThemeContextValue} from './ThemeContext';
import {useThemeContext} from './ThemeContext';

/** Хук доступа к текущей теме и переключателю. */
export function useTheme(): ThemeContextValue {
    return useThemeContext();
}
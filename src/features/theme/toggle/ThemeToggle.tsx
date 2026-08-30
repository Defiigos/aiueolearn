import type {ReactNode} from 'react';
import {useI18n} from '@/shared/lib/i18n';
import {useTheme} from '@/features/theme';
import styles from './ThemeToggle.module.css';

/** Кнопка переключения светлой/тёмной темы приложения. */
export function ThemeToggle(): ReactNode {
    const {theme, toggleTheme} = useTheme();
    const {t} = useI18n();
    const isDark = theme === 'dark';

    return (
        <button
            type="button"
            className={styles.toggle}
            onClick={toggleTheme}
            aria-label={isDark ? t('theme.toLight') : t('theme.toDark')}
            title={isDark ? t('theme.currentLight') : t('theme.currentDark')}
        >
      <span className={styles.icon} aria-hidden="true">
        {isDark ? '🌙' : '☀️'}
      </span>
        </button>
    );
}
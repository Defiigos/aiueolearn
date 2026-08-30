import {LOCALE_OPTIONS, otherLocale, useI18n} from '@/shared/lib/i18n';
import type {ReactNode} from 'react';
import styles from './LanguageToggle.module.css';

/** Кнопка переключения языка интерфейса (показывает целевой язык). */
export function LanguageToggle(): ReactNode {
    const {locale, toggleLocale, t} = useI18n();
    const target = otherLocale(locale);
    const targetLabel = LOCALE_OPTIONS.find((option) => option.value === target)?.label ?? target;

    return (
        <button
            type="button"
            className={styles.toggle}
            onClick={toggleLocale}
            aria-label={t('lang.switch')}
            title={t('lang.switch')}
        >
      <span className={styles.label} aria-hidden="true">
        {targetLabel}
      </span>
        </button>
    );
}
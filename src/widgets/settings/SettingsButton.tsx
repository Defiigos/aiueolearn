import type {ReactNode} from 'react';
import {useState} from 'react';
import {useI18n} from '@/shared/lib/i18n';
import {SettingsDialog} from './SettingsDialog';
import styles from '@/shared/ui/Button/Button.module.css';

/** Кнопка-шестерёнка в шапке: открывает окно настроек. */
export function SettingsButton(): ReactNode {
    const {t} = useI18n();
    const [open, setOpen] = useState(false);

    return (
        <>
            <button
                type="button"
                className={styles.toggle}
                onClick={() => setOpen(true)}
                aria-label={t('settings.aria')}
                title={t('settings.aria')}
            >
        <span className={styles.icon} aria-hidden="true">
          ⚙
        </span>
            </button>
            {open && <SettingsDialog onClose={() => setOpen(false)}/>}
        </>
    );
}
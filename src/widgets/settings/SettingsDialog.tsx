import type {ReactNode} from 'react';
import {useI18n} from '@/shared/lib/i18n';
import {LanguageToggle} from '@/features/i18n';
import {ThemeToggle} from '@/features/theme';
import {SoundToggle} from '@/features/sound';
import {Button, Dialog} from '@/shared/ui';
import styles from './SettingsDialog.module.css';

interface SettingsDialogProps {
    readonly onClose: () => void;
}

/**
 * Окно настроек для телефонов, собранное поверх общего примитива `Dialog`.
 * Содержит кнопки-переключатели звука, темы и языка.
 */
export function SettingsDialog({onClose}: SettingsDialogProps): ReactNode {
    const {t} = useI18n();

    return (
        <Dialog ariaLabel={t('settings.title')} onClose={onClose}>
            {(close) => (
                <>
                    <h2 className={styles.title}>{t('settings.title')}</h2>
                    <div className={styles.row}>
                        <SoundToggle/>
                        <ThemeToggle/>
                        <LanguageToggle/>
                    </div>
                    <div className={styles.actions}>
                        <Button onClick={close}>{t('settings.close')}</Button>
                    </div>
                </>
            )}
        </Dialog>
    );
}
import type {ReactNode} from 'react';
import {useI18n} from '@/shared/lib/i18n';
import {useSound} from '@/shared/lib/sound';
import {cx} from '@/shared/lib/cx';
import sharedStyles from '@/shared/ui/Button/Button.module.css';
import styles from './SoundToggle.module.css';

/** Кнопка переключения звука вкл/выкл с иконками динамика. */
export function SoundToggle(): ReactNode {
    const {soundEnabled, setSoundEnabled} = useSound();
    const {t} = useI18n();

    return (
        <button
            type="button"
            className={cx(sharedStyles.toggle, !soundEnabled && styles.muted)}
            onClick={() => setSoundEnabled(!soundEnabled)}
            aria-label={soundEnabled ? t('sound.toMute') : t('sound.toUnmute')}
            title={soundEnabled ? t('sound.currentOn') : t('sound.currentOff')}
        >
            <span className={sharedStyles.icon} aria-hidden="true">
                {soundEnabled ? '🔊' : '🔇'}
            </span>
        </button>
    );
}
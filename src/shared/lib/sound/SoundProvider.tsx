import type {ReactNode} from 'react';
import {useCallback, useEffect, useMemo, useState} from 'react';
import {
    playClick as enginePlayClick,
    playCorrect as enginePlayCorrect,
    playIncorrect as enginePlayIncorrect,
} from './audioEffects';
import {loadSoundEnabled, saveSoundEnabled} from './soundPreference';
import {speakJapanese} from './speech';
import {SoundContext, type SoundContextValue} from './SoundContext';

interface SoundProviderProps {
    readonly children: ReactNode;
}

/**
 * Провайдер звука: хранит предпочтение «звук вкл/выкл», сохраняет его
 * в localStorage и выдаёт функции воспроизведения, которые молчат при
 * отключённом звуке.
 */
export function SoundProvider({children}: SoundProviderProps): ReactNode {
    const [soundEnabled, setSoundEnabledState] = useState<boolean>(loadSoundEnabled);

    useEffect(() => {
        saveSoundEnabled(soundEnabled);
    }, [soundEnabled]);

    const setSoundEnabled = useCallback((enabled: boolean) => {
        setSoundEnabledState(enabled);
    }, []);

    const playClick = useCallback(() => {
        if (soundEnabled) {
            enginePlayClick();
        }
    }, [soundEnabled]);

    const playCorrect = useCallback(() => {
        if (soundEnabled) {
            enginePlayCorrect();
        }
    }, [soundEnabled]);

    const playIncorrect = useCallback(() => {
        if (soundEnabled) {
            enginePlayIncorrect();
        }
    }, [soundEnabled]);

    const speakKana = useCallback((symbol: string) => {
        if (soundEnabled) {
            speakJapanese(symbol);
        }
    }, [soundEnabled]);

    const value = useMemo<SoundContextValue>(
        () => ({
            soundEnabled,
            setSoundEnabled,
            playClick,
            playCorrect,
            playIncorrect,
            speakKana,
        }),
        [soundEnabled, setSoundEnabled, playClick, playCorrect, playIncorrect, speakKana],
    );

    return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}
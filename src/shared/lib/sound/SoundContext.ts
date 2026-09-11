import {createContext, useContext} from 'react';

export interface SoundContextValue {
    readonly soundEnabled: boolean;
    readonly setSoundEnabled: (enabled: boolean) => void;
    /** Короткий клик при выборе ответа. */
    readonly playClick: () => void;
    /** Подтверждающий тон правильного ответа. */
    readonly playCorrect: () => void;
    /** Тон неверного ответа / тайм-аута. */
    readonly playIncorrect: () => void;
    /** Озвучивает произношение знака (речь на японском). */
    readonly speakKana: (symbol: string) => void;
}

export const SoundContext = createContext<SoundContextValue | null>(null);

export function useSoundContext(): SoundContextValue {
    const context = useContext(SoundContext);
    if (!context) {
        throw new Error('useSound must be used within a SoundProvider');
    }
    return context;
}
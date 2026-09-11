import type {SoundContextValue} from './SoundContext';
import {useSoundContext} from './SoundContext';

/** Хук доступа к звуку: настройка «вкл/выкл» и функции воспроизведения. */
export function useSound(): SoundContextValue {
    return useSoundContext();
}
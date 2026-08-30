import {createContext, useContext} from 'react';
import type {ProgressMap} from './types';

export interface ProgressContextValue {
    /** Словарь накопленного прогресса по знакам. */
    readonly progress: ProgressMap;
    /** Учитывает один ответ по знаку, обновляя статистику. */
    readonly recordAnswer: (symbolId: string, correct: boolean) => void;
    /** Полностью сбрасывает весь прогресс. */
    readonly resetProgress: () => void;
}

export const ProgressContext = createContext<ProgressContextValue | null>(null);

export function useProgressContext(): ProgressContextValue {
    const context = useContext(ProgressContext);
    if (!context) {
        throw new Error('useProgress must be used within a ProgressProvider');
    }
    return context;
}
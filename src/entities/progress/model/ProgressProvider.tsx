import type {ReactNode} from 'react';
import {useCallback, useEffect, useState} from 'react';
import {loadProgress, saveProgress} from './progressStorage';
import {ProgressContext} from './ProgressContext';
import type {ProgressMap} from './types';

interface ProgressProviderProps {
    readonly children: ReactNode;
}

/**
 * Поставляет единственный источник правды о прогрессе и синхронизирует его
 * с localStorage. Запись происходит отложенно при изменении.
 */
export function ProgressProvider({children}: ProgressProviderProps): ReactNode {
    const [progress, setProgress] = useState<ProgressMap>(() => loadProgress());

    useEffect(() => {
        saveProgress(progress);
    }, [progress]);

    const recordAnswer = useCallback((symbolId: string, correct: boolean) => {
        setProgress((current) => {
            const existing = current[symbolId];
            return {
                ...current,
                [symbolId]: {
                    id: symbolId,
                    attempts: (existing?.attempts ?? 0) + 1,
                    correct: (existing?.correct ?? 0) + (correct ? 1 : 0),
                },
            };
        });
    }, []);

    const resetProgress = useCallback(() => {
        setProgress({});
    }, []);

    return (
        <ProgressContext.Provider value={{progress, recordAnswer, resetProgress}}>
            {children}
        </ProgressContext.Provider>
    );
}
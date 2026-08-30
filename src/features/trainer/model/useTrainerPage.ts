import {useCallback, useState} from 'react';
import type {KanaSymbol} from '@/entities/kana';
import type {QuestionResult, TrainingMode} from './types';

/** Стадии жизненного цикла страницы тренажёра. */
export type TrainerStage = 'setup' | 'session' | 'results';

/** Состояние активной сессии, закреплённое на момент её старта. */
export interface ActiveSessionState {
    readonly symbols: readonly KanaSymbol[];
    readonly repetitions: number;
    readonly mode: TrainingMode;
}

/**
 * Управляет стадиями страницы тренажёра: настройка → тренировка → результаты.
 * Сессия создаётся один раз при старте и хранится для повторного прохождения.
 */
export function useTrainerPage(): {
    readonly stage: TrainerStage;
    readonly session: ActiveSessionState | undefined;
    readonly results: readonly QuestionResult[];
    readonly startSession: (next: ActiveSessionState) => void;
    readonly finishSession: (results: readonly QuestionResult[]) => void;
    readonly restartSession: () => void;
    readonly returnToSetup: () => void;
} {
    const [stage, setStage] = useState<TrainerStage>('setup');
    const [session, setSession] = useState<ActiveSessionState>();
    const [results, setResults] = useState<readonly QuestionResult[]>([]);

    const startSession = useCallback((next: ActiveSessionState) => {
        setSession(next);
        setResults([]);
        setStage('session');
    }, []);

    const finishSession = useCallback((completedResults: readonly QuestionResult[]) => {
        setResults(completedResults);
        setStage('results');
    }, []);

    const restartSession = useCallback(() => {
        setResults([]);
        setStage('session');
    }, []);

    const returnToSetup = useCallback(() => {
        setStage('setup');
    }, []);

    return {stage, session, results, startSession, finishSession, restartSession, returnToSetup};
}
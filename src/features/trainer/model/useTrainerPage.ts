import {useCallback, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import type {KanaSymbol} from '@/entities/kana';
import type {QuestionResult, TrainingMode} from './types';

/** Стадии жизненного цикла страницы тренажёра. */
export type TrainerStage = 'setup' | 'session' | 'results';

/** URL-адреса стадий тренажёра. */
const ROUTE_SETUP = '/';
const ROUTE_SESSION = '/session';
const ROUTE_RESULTS = '/results';

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
    const navigate = useNavigate();
    const {pathname} = useLocation();

    const [session, setSession] = useState<ActiveSessionState>();
    const [results, setResults] = useState<readonly QuestionResult[]>([]);

    const stage: TrainerStage =
        pathname === ROUTE_SESSION ? 'session'
        : pathname === ROUTE_RESULTS ? 'results'
        : 'setup';

    const startSession = useCallback((next: ActiveSessionState) => {
        setSession(next);
        setResults([]);
        navigate(ROUTE_SESSION);
    }, [navigate]);

    const finishSession = useCallback((completedResults: readonly QuestionResult[]) => {
        setResults(completedResults);
        navigate(ROUTE_RESULTS);
    }, [navigate]);

    const restartSession = useCallback(() => {
        setResults([]);
        navigate(ROUTE_SESSION);
    }, [navigate]);

    const returnToSetup = useCallback(() => {
        navigate(ROUTE_SETUP);
    }, [navigate]);

    return {stage, session, results, startSession, finishSession, restartSession, returnToSetup};
}
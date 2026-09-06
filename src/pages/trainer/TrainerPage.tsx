import type {ReactNode} from 'react';
import {useProgress} from '@/entities/progress';
import {TrainerResults, TrainerSetup, TrainingSession, useTrainerDraft, useTrainerPage,} from '@/features/trainer';
import styles from './TrainerPage.module.css';

/** Страница «Тренажёр»: настройка, тренировка, результаты. */
export function TrainerPage(): ReactNode {
    const {
        draft,
        selectedSymbols,
        canStart,
        setAlphabets,
        setSet,
        setMode,
        setSessionLimit,
        setTimeLimit,
        toggleSymbol,
        setAllSymbols,
        setRow,
        setColumn,
    } = useTrainerDraft();

    const {stage, session, results, startSession, finishSession, restartSession, returnToSetup} =
        useTrainerPage();

    const {recordAnswer, resetProgress} = useProgress();

    return (
        <div className={styles.page}>
            {stage === 'setup' && (
                <TrainerSetup
                    draft={draft}
                    selectedCount={selectedSymbols.length}
                    canStart={canStart}
                    onAlphabetsChange={setAlphabets}
                    onSetChange={setSet}
                    onModeChange={setMode}
                    onSessionLimitChange={setSessionLimit}
                    onTimeLimitChange={setTimeLimit}
                    onToggleSymbol={toggleSymbol}
                    onSetRow={setRow}
                    onSetColumn={setColumn}
                    onSetAll={setAllSymbols}
                    onResetProgress={resetProgress}
                    onStart={() =>
                        startSession({
                            symbols: selectedSymbols,
                            sessionLimit: draft.sessionLimit,
                            mode: draft.mode,
                            timeLimit: draft.timeLimit,
                        })
                    }
                />
            )}

            {stage === 'session' && session && (
                <TrainingSession
                    symbols={session.symbols}
                    sessionLimit={session.sessionLimit}
                    mode={session.mode}
                    timeLimit={session.timeLimit}
                    onFinish={finishSession}
                    onAnswer={recordAnswer}
                />
            )}

            {stage === 'results' && (
                <TrainerResults results={results} onRestart={restartSession} onHome={returnToSetup}/>
            )}
        </div>
    );
}
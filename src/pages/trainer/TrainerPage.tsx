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
        setRepetitions,
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
                    onRepetitionsChange={setRepetitions}
                    onToggleSymbol={toggleSymbol}
                    onSetRow={setRow}
                    onSetColumn={setColumn}
                    onSetAll={setAllSymbols}
                    onResetProgress={resetProgress}
                    onStart={() =>
                        startSession({
                            symbols: selectedSymbols,
                            repetitions: draft.repetitions,
                            mode: draft.mode,
                        })
                    }
                />
            )}

            {stage === 'session' && session && (
                <TrainingSession
                    symbols={session.symbols}
                    repetitions={session.repetitions}
                    mode={session.mode}
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
import type {ReactNode} from 'react';
import {useMemo} from 'react';
import type {KanaSymbol} from '@/entities/kana';
import {findKanaById} from '@/entities/kana';
import {useI18n} from '@/shared/lib/i18n';
import {cx} from '@/shared/lib/cx';
import {Card, ProgressBar} from '@/shared/ui';
import {useTrainingSession} from '@/features/trainer';
import {formatDuration} from '../../model/time';
import type {AnswerTimeLimit, QuestionResult, TrainingMode} from '../../model/types';
import {ChoiceQuestion} from '../ChoiceQuestion/ChoiceQuestion';
import {QuestionFeedback} from '../QuestionFeedback/QuestionFeedback';
import {TypingQuestion} from '../TypingQuestion/TypingQuestion';
import styles from './TrainingSession.module.css';

interface TrainingSessionProps {
    readonly symbols: readonly KanaSymbol[];
    readonly repetitions: number;
    readonly mode: TrainingMode;
    readonly timeLimit: AnswerTimeLimit;
    readonly onFinish: (results: readonly QuestionResult[]) => void;
    /** Учитывает каждый ответ пользователя по знаку (для прогресса). */
    readonly onAnswer?: (symbolId: string, correct: boolean) => void;
}

const URGENT_SECONDS = 10;

/**
 * Активный режим тренировки. Хук `useTrainingSession` здесь монтируется
 * только на время сессии, поэтому вызывается безусловно.
 */
export function TrainingSession({
                                    symbols,
                                    repetitions,
                                    mode,
                                    timeLimit,
                                    onFinish,
                                    onAnswer,
                                }: TrainingSessionProps): ReactNode {
    const {index, total, question, answered, results, elapsedMs, limitSeconds, submitTyping, submitChoice, next} =
        useTrainingSession(symbols, repetitions, mode, timeLimit, onFinish);
    const {t} = useI18n();

    const lastResult = results[results.length - 1];
    const isLast = index + 1 >= total;

    const remainingSeconds = limitSeconds == null
        ? undefined
        : Math.max(0, limitSeconds - elapsedMs / 1000);
    const isUrgent = remainingSeconds != null && remainingSeconds <= URGENT_SECONDS;

    // Отображаемые строки ответа зависят от типа вопроса.
    const feedback = useMemo(() => {
        if (!lastResult) {
            return undefined;
        }
        if (lastResult.question.kind === 'choice') {
            const submitted = findKanaById(lastResult.submitted)?.symbol ?? lastResult.submitted;
            return {
                submittedDisplay: submitted,
                correctDisplay: lastResult.question.correct.symbol,
            };
        }
        return {
            submittedDisplay: lastResult.submitted,
            correctDisplay: lastResult.question.prompt.romaji,
        };
    }, [lastResult]);

    return (
        <div className={styles.wrapper}>
            <header className={styles.header}>
        <span className={styles.counter}>
          {t('session.step', {current: index + 1, total})}
        </span>
                {limitSeconds != null && !answered && (
                    <span
                        className={cx(styles.timer, isUrgent && styles.timerUrgent)}
                        role="timer"
                        aria-live="off"
                    >
            {t('session.timeLeft', {
                time: formatDuration(remainingSeconds ?? 0),
            })}
          </span>
                )}
                <ProgressBar className={styles.progress} value={index + (answered ? 1 : 0)} max={total}/>
            </header>

            <Card className={styles.card}>
                {question && (
                    <>
                        {!answered && question.kind === 'typing' && (
                            <TypingQuestion
                                symbol={question.prompt.symbol}
                                onSubmit={(romaji) => {
                                    submitTyping(romaji);
                                    onAnswer?.(question.prompt.id, question.prompt.romaji === romaji);
                                }}
                            />
                        )}
                        {!answered && question.kind === 'choice' && (
                            <ChoiceQuestion
                                romaji={question.promptRomaji}
                                options={question.options}
                                onSubmit={(symbolId) => {
                                    submitChoice(symbolId);
                                    onAnswer?.(question.correct.id, question.correct.id === symbolId);
                                }}
                            />
                        )}
                        {answered && lastResult && feedback && (
                            <QuestionFeedback
                                status={lastResult.status}
                                timeSeconds={lastResult.durationMs / 1000}
                                submittedDisplay={feedback.submittedDisplay}
                                correctDisplay={feedback.correctDisplay}
                                onNext={next}
                                isLast={isLast}
                            />
                        )}
                    </>
                )}
            </Card>
        </div>
    );
}
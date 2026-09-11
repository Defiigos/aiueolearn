import type {ReactNode} from 'react';
import {useEffect, useMemo} from 'react';
import type {KanaSymbol} from '@/entities/kana';
import {findKanaById} from '@/entities/kana';
import {useI18n} from '@/shared/lib/i18n';
import {useSound} from '@/shared/lib/sound';
import {cx} from '@/shared/lib/cx';
import {Card, ProgressBar} from '@/shared/ui';
import {useTrainingSession} from '@/features/trainer';
import {formatDuration} from '../../model/time';
import type {AnswerTimeLimit, QuestionResult, SessionLimit, TrainingMode} from '../../model/types';
import {ChoiceQuestion} from '../ChoiceQuestion/ChoiceQuestion';
import {QuestionFeedback} from '../QuestionFeedback/QuestionFeedback';
import {RomajiQuestion} from '../RomajiQuestion/RomajiQuestion';
import {TypingQuestion} from '../TypingQuestion/TypingQuestion';
import styles from './TrainingSession.module.css';

interface TrainingSessionProps {
    readonly symbols: readonly KanaSymbol[];
    readonly sessionLimit: SessionLimit;
    readonly mode: TrainingMode;
    readonly timeLimit: AnswerTimeLimit;
    readonly onFinish: (results: readonly QuestionResult[]) => void;
    /** Учитывает каждый ответ пользователя по знаку (для прогресса). */
    readonly onAnswer?: (symbolId: string, correct: boolean) => void;
}

const URGENT_SECONDS = 10;

/** Читаемый ответ пользователя по типу вопроса (для обратной связи). */
function submittedDisplay(result: QuestionResult): string {
    if (result.question.kind === 'choice') {
        return findKanaById(result.submitted)?.symbol ?? result.submitted;
    }
    return result.submitted;
}

/** Читаемый правильный ответ по типу вопроса (для обратной связи). */
function correctDisplay(result: QuestionResult): string {
    const q = result.question;
    switch (q.kind) {
        case 'choice':
            return q.correct.symbol;
        case 'typing':
            return q.prompt.romaji;
        case 'romaji':
            return q.correct;
    }
}

/**
 * Активный режим тренировки. Хук `useTrainingSession` здесь монтируется
 * только на время сессии, поэтому вызывается безусловно.
 */
export function TrainingSession({
                                    symbols,
                                    sessionLimit,
                                    mode,
                                    timeLimit,
                                    onFinish,
                                    onAnswer,
                                }: TrainingSessionProps): ReactNode {
    const {
        index,
        total,
        question,
        answered,
        results,
        elapsedMs,
        limitSeconds,
        sessionRemainingMs,
        submitTyping,
        submitChoice,
        submitRomaji,
        next,
    } = useTrainingSession(symbols, sessionLimit, mode, timeLimit, onFinish);
    const {t} = useI18n();
    const {playClick, playCorrect, playIncorrect, speakKana} = useSound();

    const lastResult = results[results.length - 1];
    const isTimed = sessionLimit.kind === 'time';
    const isLast = !isTimed && index + 1 >= (total ?? 0);

    // Озвучиваем знак при появлении вопроса «выбери знак» (обучающее произношение).
    useEffect(() => {
        if (question?.kind === 'choice' && !answered) {
            speakKana(question.correct.symbol);
        }
    }, [question, answered, speakKana]);

    // Звуковой отклик на исход последнего ответа (правильно/неверно/тайм-аут).
    useEffect(() => {
        if (!lastResult) {
            return;
        }
        if (lastResult.status === 'correct') {
            playCorrect();
        } else {
            playIncorrect();
        }
    }, [lastResult, playCorrect, playIncorrect]);

    const remainingSeconds = limitSeconds == null
        ? undefined
        : Math.max(0, limitSeconds - elapsedMs / 1000);
    const isUrgent =
        (remainingSeconds != null && remainingSeconds <= URGENT_SECONDS) ||
        (sessionRemainingMs != null && sessionRemainingMs / 1000 <= URGENT_SECONDS);

    // Отображаемые строки ответа зависят от типа вопроса.
    const feedback = useMemo(() => {
        if (!lastResult) {
            return undefined;
        }
        return {
            submittedDisplay: submittedDisplay(lastResult),
            correctDisplay: correctDisplay(lastResult),
        };
    }, [lastResult]);

    const headerStep = isTimed
        ? t('session.answered', {count: results.length})
        : t('session.step', {current: index + 1, total: total ?? 0});

    return (
        <div className={styles.wrapper}>
            <header className={styles.header}>
        <span className={styles.counter}>{headerStep}</span>
                {isTimed && sessionRemainingMs != null && (
                    <span
                        className={cx(styles.timer, isUrgent && styles.timerUrgent)}
                        role="timer"
                        aria-live="off"
                    >
            {t('session.timeTotal', {
                time: formatDuration(sessionRemainingMs / 1000),
            })}
          </span>
                )}
                {
                    limitSeconds != null && !answered && (
                        <span
                            className={cx(styles.timer, isUrgent && styles.timerUrgent)}
                            role="timer"
                            aria-live="off"
                        >
            {t('session.timeLeft', {
                time: formatDuration(remainingSeconds ?? 0),
            })}
          </span>
                    )
                }
                <ProgressBar
                    className={styles.progress}
                    value={sessionLimit.kind === 'time'
                        ? sessionLimit.seconds - (sessionRemainingMs ?? 0) / 1000
                        : index + (answered ? 1 : 0)}
                    max={sessionLimit.kind === 'time' ? sessionLimit.seconds : total ?? 0}
                />
            </header>

            <Card className={styles.card}>
                {question && (
                    <>
                        {!answered && question.kind === 'typing' && (
                            <TypingQuestion
                                symbol={question.prompt.symbol}
                                onSubmit={(romaji) => {
                                    playClick();
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
                                    playClick();
                                    const selected = question.options.find((option) => option.id === symbolId);
                                    if (selected) {
                                        speakKana(selected.symbol);
                                    }
                                    submitChoice(symbolId);
                                    onAnswer?.(question.correct.id, question.correct.id === symbolId);
                                }}
                            />
                        )}
                        {!answered && question.kind === 'romaji' && (
                            <RomajiQuestion
                                symbol={question.prompt}
                                options={question.options}
                                onSubmit={(romaji) => {
                                    playClick();
                                    submitRomaji(romaji);
                                    onAnswer?.(question.prompt.id, question.correct === romaji);
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
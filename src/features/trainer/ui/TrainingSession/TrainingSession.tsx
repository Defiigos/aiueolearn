import type {ReactNode} from 'react';
import {useMemo} from 'react';
import type {KanaSymbol} from '@/entities/kana';
import {findKanaById} from '@/entities/kana';
import {useI18n} from '@/shared/lib/i18n';
import {Card, ProgressBar} from '@/shared/ui';
import {useTrainingSession} from '@/features/trainer';
import type {QuestionResult, TrainingMode} from '../../model/types';
import {ChoiceQuestion} from '../ChoiceQuestion/ChoiceQuestion';
import {QuestionFeedback} from '../QuestionFeedback/QuestionFeedback';
import {TypingQuestion} from '../TypingQuestion/TypingQuestion';
import styles from './TrainingSession.module.css';

interface TrainingSessionProps {
    readonly symbols: readonly KanaSymbol[];
    readonly repetitions: number;
    readonly mode: TrainingMode;
    readonly onFinish: (results: readonly QuestionResult[]) => void;
    /** Учитывает каждый ответ пользователя по знаку (для прогресса). */
    readonly onAnswer?: (symbolId: string, correct: boolean) => void;
}

/**
 * Активный режим тренировки. Хук `useTrainingSession` здесь монтируется
 * только на время сессии, поэтому вызывается безусловно.
 */
export function TrainingSession({
                                    symbols,
                                    repetitions,
                                    mode,
                                    onFinish,
                                    onAnswer,
                                }: TrainingSessionProps): ReactNode {
    const {index, total, question, answered, results, submitTyping, submitChoice, next} =
        useTrainingSession(symbols, repetitions, mode, onFinish);
    const {t} = useI18n();

    const lastResult = results[results.length - 1];
    const isLast = index + 1 >= total;

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
                                isCorrect={lastResult.status === 'correct'}
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
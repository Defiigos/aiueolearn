import {ReactNode, useEffect} from 'react';
import {useI18n} from '@/shared/lib/i18n';
import {cx} from '@/shared/lib/cx';
import {Button} from '@/shared/ui';
import {formatDuration} from '../../model/time';
import type {AnswerStatus} from '../../model/types';
import styles from './QuestionFeedback.module.css';

interface QuestionFeedbackProps {
    readonly status: AnswerStatus;
    /** Сколько времени занял ответ, в секундах. */
    readonly timeSeconds: number;
    /** Ответ пользователя в читаемом виде (ромадзи или символ). */
    readonly submittedDisplay: string;
    /** Правильный ответ в читаемом виде. */
    readonly correctDisplay: string;
    readonly onNext: () => void;
    readonly isLast: boolean;
}

/** Обратная связь после ответа: исход, время траты и кнопка «Далее». */
export function QuestionFeedback({
                                     status,
                                     timeSeconds,
                                     submittedDisplay,
                                     correctDisplay,
                                     onNext,
                                     isLast,
                                 }: QuestionFeedbackProps): ReactNode {
    const {t} = useI18n();
    const isCorrect = status === 'correct';
    const timedOut = status === 'timeout';

    useEffect(() => {
        const mountedAt = performance.now();
        const keyDownHandler = (event: KeyboardEvent): void => {
            if (event.timeStamp >= mountedAt && event.key === 'Enter') {
                onNext();
            }
        };

        window.addEventListener('keydown', keyDownHandler);
        return () => window.removeEventListener('keydown', keyDownHandler);
    }, [onNext]);

    const title = timedOut ? t('feedback.timeout') : isCorrect ? t('feedback.correct') : t('feedback.wrong');

    return (
        <div className={cx(styles.wrapper, isCorrect ? styles.goodBg : styles.badBg)}>
            <p className={cx(styles.title, isCorrect ? styles.good : styles.bad)}>{title}</p>
            {!isCorrect && !timedOut && (
                <p className={styles.detail}>
                    {t('feedback.detail', {submitted: submittedDisplay, correct: correctDisplay})}
                </p>
            )}
            <p className={styles.time}>{t('feedback.timeSpent', {time: formatDuration(timeSeconds)})}</p>
            <div className={styles.actions}>
                <Button onClick={onNext}>{isLast ? t('feedback.finish') : t('feedback.next')}</Button>
            </div>
        </div>
    );
}
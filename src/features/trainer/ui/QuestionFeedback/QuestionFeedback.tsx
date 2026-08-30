import {ReactNode, useEffect} from 'react';
import {useI18n} from '@/shared/lib/i18n';
import {cx} from '@/shared/lib/cx';
import {Button} from '@/shared/ui';
import styles from './QuestionFeedback.module.css';

interface QuestionFeedbackProps {
    readonly isCorrect: boolean;
    /** Ответ пользователя в читаемом виде (ромадзи или символ). */
    readonly submittedDisplay: string;
    /** Правильный ответ в читаемом виде. */
    readonly correctDisplay: string;
    readonly onNext: () => void;
    readonly isLast: boolean;
}

/** Обратная связь после ответа: правильно/неправильно и кнопка «Далее». */
export function QuestionFeedback({
                                     isCorrect,
                                     submittedDisplay,
                                     correctDisplay,
                                     onNext,
                                     isLast,
                                 }: QuestionFeedbackProps): ReactNode {
    const {t} = useI18n();

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

    return (
        <div className={cx(styles.wrapper, isCorrect ? styles.goodBg : styles.badBg)}>
            <p className={cx(styles.title, isCorrect ? styles.good : styles.bad)}>
                {isCorrect ? t('feedback.correct') : t('feedback.wrong')}
            </p>
            {!isCorrect && (
                <p className={styles.detail}>
                    {t('feedback.detail', {submitted: submittedDisplay, correct: correctDisplay})}
                </p>
            )}
            <div className={styles.actions}>
                <Button onClick={onNext}>{isLast ? t('feedback.finish') : t('feedback.next')}</Button>
            </div>
        </div>
    );
}
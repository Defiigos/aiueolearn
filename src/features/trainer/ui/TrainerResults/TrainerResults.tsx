import type {ReactNode} from 'react';
import {useI18n} from '@/shared/lib/i18n';
import {Button, Card} from '@/shared/ui';
import {formatDuration} from '../../model/time';
import type {QuestionResult} from '../../model/types';
import {MistakeList} from './MistakeList';
import styles from './TrainerResults.module.css';

interface TrainerResultsProps {
    readonly results: readonly QuestionResult[];
    readonly onRestart: () => void;
    readonly onHome: () => void;
}

/** Итоговый экран тренировки со статистикой и списком ошибок. */
export function TrainerResults({
                                   results,
                                   onRestart,
                                   onHome,
                               }: TrainerResultsProps): ReactNode {
    const {t} = useI18n();
    const total = results.length;
    const correct = results.filter((result) => result.status === 'correct').length;
    const wrong = total - correct;
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
    const mistakes = results.filter((result) => result.status === 'incorrect');
    const timeouts = results.filter((result) => result.status === 'timeout').length;
    const totalSeconds = total > 0 ? results.reduce((sum, result) => sum + result.durationMs, 0) / 1000 : 0;
    const avgSeconds = total > 0 ? totalSeconds / total : 0;

    return (
        <div className={styles.wrapper}>
            <Card className={styles.card}>
                <h2 className={styles.title}>{t('results.title')}</h2>
                <dl className={styles.stats}>
                    <div className={styles.stat}>
                        <dt className={styles.statLabel}>{t('results.correct')}</dt>
                        <dd className={styles.statValue}>
                            {correct} / {total}
                        </dd>
                    </div>
                    <div className={styles.stat}>
                        <dt className={styles.statLabel}>{t('results.wrong')}</dt>
                        <dd className={styles.statValue}>{wrong}</dd>
                    </div>
                    <div className={styles.stat}>
                        <dt className={styles.statLabel}>{t('results.accuracy')}</dt>
                        <dd className={styles.statValue}>{accuracy}%</dd>
                    </div>
                    <div className={styles.stat}>
                        <dt className={styles.statLabel}>{t('results.totalTime')}</dt>
                        <dd className={styles.statValue}>{formatDuration(totalSeconds)}</dd>
                    </div>
                    <div className={styles.stat}>
                        <dt className={styles.statLabel}>{t('results.avgTime')}</dt>
                        <dd className={styles.statValue}>{formatDuration(avgSeconds)}</dd>
                    </div>
                    <div className={styles.stat}>
                        <dt className={styles.statLabel}>{t('results.timeout')}</dt>
                        <dd className={styles.statValue}>{timeouts}</dd>
                    </div>
                </dl>

                <MistakeList mistakes={mistakes}/>

                <div className={styles.actions}>
                    <Button onClick={onRestart}>{t('results.trainAgain')}</Button>
                    <Button variant="secondary" onClick={onHome}>
                        {t('results.toSettings')}
                    </Button>
                </div>
            </Card>
        </div>
    );
}
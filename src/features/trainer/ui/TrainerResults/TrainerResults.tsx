import type {ReactNode} from 'react';
import {useI18n} from '@/shared/lib/i18n';
import {Button, Card} from '@/shared/ui';
import type {QuestionResult} from '../../model/types';
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
                </dl>

                {mistakes.length > 0 && (
                    <div className={styles.mistakes}>
                        <h3 className={styles.mistakesTitle}>{t('results.review')}</h3>
                        <ul className={styles.list}>
                            {mistakes.map((result, index) => (
                                <li key={index} className={styles.item}>
                  <span className={styles.prompt}>
                    {result.question.kind === 'choice'
                        ? result.question.promptRomaji
                        : result.question.prompt.symbol}
                  </span>
                                    <span className={styles.arrow}>→</span>
                                    <span className={styles.correct}>
                    {result.question.kind === 'choice'
                        ? result.question.correct.symbol
                        : result.question.prompt.romaji}
                  </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

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
import type {ReactNode} from 'react';
import {useI18n} from '@/shared/lib/i18n';
import type {QuestionResult} from '../../model/types';
import styles from './MistakeList.module.css';

interface MistakeListProps {
    readonly mistakes: readonly QuestionResult[];
}

/** Группа ошибок по знаку: один вопрос на знак и количество ошибок на нём. */
interface MistakeGroup {
    readonly result: QuestionResult;
    readonly count: number;
}

/** Идентификатор знака, к которому относится вопрос. */
function symbolIdOf(result: QuestionResult): string {
    const q = result.question;
    switch (q.kind) {
        case 'typing':
        case 'romaji':
            return q.prompt.id;
        case 'choice':
            return q.correct.id;
    }
}

/** Сворачивает ошибки в группы по знаку, сохраняя порядок первого появления. */
function groupMistakes(mistakes: readonly QuestionResult[]): MistakeGroup[] {
    const byId = new Map<string, MistakeGroup>();
    for (const result of mistakes) {
        const id = symbolIdOf(result);
        const existing = byId.get(id);
        if (existing) {
            byId.set(id, {result: existing.result, count: existing.count + 1});
        } else {
            byId.set(id, {result, count: 1});
        }
    }
    return [...byId.values()];
}

/** Список знаков, на которых были ошибки, без повторов и со счётчиком ошибок. */
export function MistakeList({mistakes}: MistakeListProps): ReactNode {
    const {t} = useI18n();
    const groups = groupMistakes(mistakes);

    if (groups.length === 0) {
        return null;
    }

    return (
        <div className={styles.mistakes}>
            <h3 className={styles.title}>{t('results.review')}</h3>
            <ul className={styles.list}>
                {groups.map((group) => {
                    const {result} = group;
                    return (
                        <li key={symbolIdOf(result)} className={styles.item}>
                            <span className={styles.prompt}>
                {result.question.kind === 'choice'
                    ? result.question.promptRomaji
                    : result.question.prompt.symbol}
              </span>
                            <span className={styles.arrow}>→</span>
                            <span className={styles.correct}>
                {result.question.kind === 'choice'
                    ? result.question.correct.symbol
                    : result.question.kind === 'romaji'
                        ? result.question.correct
                        : result.question.prompt.romaji}
              </span>
                            {group.count > 1 && (
                                <span
                                    className={styles.count}
                                    title={t('results.mistakeCount', {count: group.count})}
                                >
                    ×{group.count}
                  </span>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
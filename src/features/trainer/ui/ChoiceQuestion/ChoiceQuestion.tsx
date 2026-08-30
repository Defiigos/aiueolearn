import type {ReactNode} from 'react';
import {useI18n} from '@/shared/lib/i18n';
import type {KanaSymbol} from '@/entities/kana';
import styles from './ChoiceQuestion.module.css';

interface ChoiceQuestionProps {
    readonly romaji: string;
    readonly options: readonly KanaSymbol[];
    readonly onSubmit: (symbolId: string) => void;
}

/** Вопрос «выбери знак»: показывается ромадзи, на выбор предлагаются знаки. */
export function ChoiceQuestion({romaji, options, onSubmit}: ChoiceQuestionProps): ReactNode {
    const {t} = useI18n();

    return (
        <div className={styles.wrapper}>
            <div className={styles.prompt}>{romaji}</div>
            <div className={styles.grid} role="group" aria-label={t('choice.aria')}>
                {options.map((option) => (
                    <button
                        key={option.id}
                        type="button"
                        className={styles.option}
                        onClick={() => onSubmit(option.id)}
                    >
                        {option.symbol}
                    </button>
                ))}
            </div>
        </div>
    );
}
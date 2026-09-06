import type {ReactNode} from 'react';
import {useI18n} from '@/shared/lib/i18n';
import type {KanaSymbol} from '@/entities/kana';
import styles from './RomajiQuestion.module.css';

interface RomajiQuestionProps {
    readonly symbol: KanaSymbol;
    readonly options: readonly string[];
    readonly onSubmit: (romaji: string) => void;
}

/** Вопрос «выбери ромадзи»: показывается знак, на выбор предлагаются чтения. */
export function RomajiQuestion({symbol, options, onSubmit}: RomajiQuestionProps): ReactNode {
    const {t} = useI18n();

    return (
        <div className={styles.wrapper}>
            <div className={styles.prompt}>{symbol.symbol}</div>
            <div className={styles.grid} role="group" aria-label={t('romaji.aria')}>
                {options.map((option) => (
                    <button
                        key={option}
                        type="button"
                        className={styles.option}
                        onClick={() => onSubmit(option)}
                    >
                        {option}
                    </button>
                ))}
            </div>
        </div>
    );
}
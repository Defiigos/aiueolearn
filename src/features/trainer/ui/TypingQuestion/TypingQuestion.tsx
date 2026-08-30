import type {ReactNode} from 'react';
import {useState} from 'react';
import {useI18n} from '@/shared/lib/i18n';
import {KanaGlyph} from '@/shared/ui';
import styles from './TypingQuestion.module.css';

interface TypingQuestionProps {
    readonly symbol: string;
    readonly onSubmit: (romaji: string) => void;
}

/** Вопрос «напиши ромадзи»: показывается знак, вводится его чтение. */
export function TypingQuestion({symbol, onSubmit}: TypingQuestionProps): ReactNode {
    const {t} = useI18n();
    const [value, setValue] = useState('');

    const submit = (): void => {
        const trimmed = value.trim().toLowerCase();
        if (trimmed.length === 0) {
            return;
        }
        onSubmit(trimmed);
        setValue('');
    };

    const keyDownHandler = (event: React.KeyboardEvent<HTMLInputElement>): void => {
        if (event.key === 'Enter') {
            submit();
        }
    };

    return (
        <div className={styles.wrapper}>
            <KanaGlyph char={symbol} size="xl"/>
            <div className={styles.row}>
                <input
                    className={styles.input}
                    type="text"
                    value={value}
                    autoFocus
                    spellCheck={false}
                    autoComplete="off"
                    placeholder={t('typing.placeholder')}
                    aria-label={t('typing.inputAria')}
                    onChange={(event) => setValue(event.target.value.replace(/[^a-zA-Z]/g, ''))}
                    onKeyDown={keyDownHandler}
                />
                <button type="button" className={styles.button} onClick={submit} disabled={!value}>
                    {t('typing.submit')}
                </button>
            </div>
        </div>
    );
}
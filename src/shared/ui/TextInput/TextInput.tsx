import {cx} from '@/shared/lib/cx';
import type {ReactNode} from 'react';
import styles from './TextInput.module.css';

interface TextInputProps {
    readonly value: string;
    readonly onChange: (value: string) => void;
    readonly placeholder?: string;
    readonly autoFocus?: boolean;
    readonly inputMode?: 'text' | 'latin' | 'numeric';
    readonly ariaLabel?: string;
    readonly disabled?: boolean;
}

/** Переиспользуемое текстовое поле. */
export function TextInput({
                              value,
                              onChange,
                              placeholder,
                              autoFocus = false,
                              inputMode,
                              ariaLabel,
                              disabled = false,
                          }: TextInputProps): ReactNode {
    const changeHandler = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const nextValue = event.target.value;
        if (inputMode === 'latin') {
            onChange(nextValue.replace(/[^a-zA-Z]/g, '').toLowerCase());
        } else {
            onChange(nextValue);
        }
    };

    return (
        <input
            className={cx(styles.input, disabled && styles.disabled)}
            type="text"
            value={value}
            disabled={disabled}
            placeholder={placeholder}
            autoFocus={autoFocus}
            aria-label={ariaLabel}
            onChange={changeHandler}
        />
    );
}
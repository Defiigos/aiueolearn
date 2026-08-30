import {cx} from '@/shared/lib/cx';
import type {ReactNode} from 'react';
import styles from './SegmentedControl.module.css';

interface Option<T extends string> {
    readonly value: T;
    readonly label: ReactNode;
    readonly disabled?: boolean;
}

interface SegmentedControlProps<T extends string> {
    readonly options: readonly Option<T>[];
    readonly value: T | ReadonlyArray<T>;
    readonly onChange: (value: T) => void;
    readonly multiple?: boolean;
    readonly ariaLabel: string;
}

/**
 * Сегментированный переключатель. При `multiple` работает как набор тумблеров,
 * у каждого из которых независимое состояние «включён».
 */
export function SegmentedControl<T extends string>({
                                                       options,
                                                       value,
                                                       onChange,
                                                       multiple = false,
                                                       ariaLabel,
                                                   }: SegmentedControlProps<T>): ReactNode {
    const toggled = new Set<T>(Array.isArray(value) ? value : []);

    const selectOption = (optionValue: T, disabled?: boolean): void => {
        if (disabled) {
            return;
        }
        onChange(optionValue);
    };

    return (
        <div className={styles.group} role="group" aria-label={ariaLabel}>
            {options.map((option) => {
                const active = multiple ? toggled.has(option.value) : value === option.value;
                const classes = cx(styles.segment, active && styles.active);

                return (
                    <button
                        key={option.value}
                        type="button"
                        className={classes}
                        aria-pressed={active}
                        disabled={option.disabled}
                        onClick={() => selectOption(option.value, option.disabled)}
                    >
                        {option.label}
                    </button>
                );
            })}
        </div>
    );
}
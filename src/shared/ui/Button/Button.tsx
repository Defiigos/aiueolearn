import {cx} from '@/shared/lib/cx';
import type {ReactNode} from 'react';
import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
    readonly children: ReactNode;
    readonly type?: 'button' | 'submit';
    readonly variant?: ButtonVariant;
    readonly size?: ButtonSize;
    readonly disabled?: boolean;
    readonly className?: string;
    readonly onClick?: () => void;
}

/** Переиспользуемая кнопка на основе токенов дизайна. */
export function Button({
                           children,
                           type = 'button',
                           variant = 'primary',
                           size = 'md',
                           disabled = false,
                           className,
                           onClick,
                       }: ButtonProps): ReactNode {
    const classes = cx(styles.button, styles[variant], styles[size], className, disabled && styles.disabled);

    return (
        <button type={type} className={classes} disabled={disabled} onClick={onClick}>
            {children}
        </button>
    );
}
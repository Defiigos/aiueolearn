import {cx} from '@/shared/lib/cx';
import type {ReactNode} from 'react';
import styles from './ProgressBar.module.css';

interface ProgressBarProps {
    readonly value: number;
    readonly max: number;
    readonly className?: string;
}

/** Полоса прогресса. `value`/`max` — количество выполненных и всего шагов. */
export function ProgressBar({value, max, className}: ProgressBarProps): ReactNode {
    const percent = max > 0 ? Math.min(100, (value / max) * 100) : 0;

    return (
        <div
            className={cx(styles.track, className)}
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={max}
            aria-valuenow={value}
        >
            <div className={styles.fill} style={{width: `${percent}%`}}/>
        </div>
    );
}
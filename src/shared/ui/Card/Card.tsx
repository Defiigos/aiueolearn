import {cx} from '@/shared/lib/cx';
import type {ReactNode} from 'react';
import styles from './Card.module.css';

interface CardProps {
    readonly children: ReactNode;
    readonly className?: string;
}

/** Контейнер с фоновой поверхностью и тенью. */
export function Card({children, className}: CardProps): ReactNode {
    return <div className={cx(styles.card, className)}>{children}</div>;
}
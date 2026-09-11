import type {ReactNode} from 'react';
import {useEffect, useRef, useState} from 'react';
import {cx} from '@/shared/lib/cx';
import styles from './Dialog.module.css';

/** Тип контента диалога: функция, получающая триггер закрытия. */
type DialogContent = (close: () => void) => ReactNode;

interface DialogProps {
    readonly ariaLabel: string;
    readonly onClose: () => void;
    readonly children: DialogContent;
}

/** Длительность анимации исчезания плюс запас (для отката без animationend). */
const CLOSE_FALLBACK_MS = 200;

/**
 * Общий примитив модального окна: оверлей, оболочка с role="dialog",
 * закрытие по клику вне, кнопке Escape или через `close` из контента,
 * плавное появление/исчезание.
 */
export function Dialog({ariaLabel, onClose, children}: DialogProps): ReactNode {
    const [closing, setClosing] = useState(false);
    // Защита от двойного вызова onClose (анимация + запасной таймер).
    const closedRef = useRef(false);

    useEffect(() => {
        if (!closing) {
            return;
        }
        // В режиме prefers-reduced-motion анимация отключена и событие
        // animationend не срабатывает — используем таймер как откат.
        const timer = window.setTimeout(() => {
            if (!closedRef.current) {
                closedRef.current = true;
                onClose();
            }
        }, CLOSE_FALLBACK_MS);
        return () => window.clearTimeout(timer);
    }, [closing, onClose]);

    const close = (): void => setClosing(true);

    return (
        <div
            className={cx(styles.backdrop, closing && styles.backdropClosing)}
            onClick={close}
        >
            <div
                className={cx(styles.dialog, closing && styles.dialogClosing)}
                role="dialog"
                aria-modal="true"
                aria-label={ariaLabel}
                onClick={(event) => event.stopPropagation()}
                onKeyDown={(event) => {
                    if (event.key === 'Escape') {
                        close();
                    }
                }}
                onAnimationEnd={() => {
                    if (closing && !closedRef.current) {
                        closedRef.current = true;
                        onClose();
                    }
                }}
            >
                {children(close)}
            </div>
        </div>
    );
}
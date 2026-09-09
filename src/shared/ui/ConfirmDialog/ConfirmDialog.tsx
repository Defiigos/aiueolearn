import type {ReactNode} from 'react';
import {useState} from 'react';
import {cx} from '@/shared/lib/cx';
import {Button} from '@/shared/ui';
import styles from './ConfirmDialog.module.css';

interface ConfirmDialogProps {
    readonly title: string;
    readonly message: string;
    readonly confirmLabel: string;
    readonly cancelLabel: string;
    readonly onConfirm: () => void;
    readonly onCancel: () => void;
}

/**
 * Модальное окно подтверждения с действиями «Подтвердить»/«Отмена».
 * Плавно появляется и исчезает; закрывается по клику вне диалога, кнопке
 * «Отмена» или клавише Escape. Родитель размонтирует компонент только после
 * того, как сработает анимация исчезания (вызовется `onCancel`).
 */
export function ConfirmDialog({
                                  title,
                                  message,
                                  confirmLabel,
                                  cancelLabel,
                                  onConfirm,
                                  onCancel,
                              }: ConfirmDialogProps): ReactNode {
    // Почему закрываем: по завершении анимации исчезания вызываем
    // соответствующий колбэк, чтобы родитель размонтировал компонент не сразу.
    const [closingFor, setClosingFor] = useState<'confirm' | 'cancel' | null>(null);

    const requestClose = (): void => setClosingFor('cancel');
    const requestConfirm = (): void => setClosingFor('confirm');

    return (
        <div
            className={cx(styles.backdrop, closingFor !== null && styles.backdropClosing)}
            onClick={requestClose}
        >
            <div
                className={cx(styles.dialog, closingFor !== null && styles.dialogClosing)}
                role="dialog"
                aria-modal="true"
                aria-label={title}
                onClick={(event) => event.stopPropagation()}
                onKeyDown={(event) => {
                    if (event.key === 'Escape') {
                        requestClose();
                    }
                }}
                onAnimationEnd={() => {
                    if (closingFor === 'cancel') {
                        onCancel();
                    } else if (closingFor === 'confirm') {
                        onConfirm();
                    }
                }}
            >
                <h2 className={styles.title}>
                    {title}
                </h2>
                <p className={styles.message}>{message}</p>
                <div className={styles.actions}>
                    <Button variant="ghost" onClick={requestClose}>
                        {cancelLabel}
                    </Button>
                    <Button variant="danger" onClick={requestConfirm}>
                        {confirmLabel}
                    </Button>
                </div>
            </div>
        </div>
    );
}
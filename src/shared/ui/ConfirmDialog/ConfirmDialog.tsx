import type {ReactNode} from 'react';
import {useState} from 'react';
import {Button, Dialog} from '@/shared/ui';
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
 * Диалог подтверждения, собранный поверх общего примитива `Dialog`.
 * Контент — заголовок, сообщение и кнопки «Отмена»/«Подтвердить». Исход
 * (подтвердить или отменить) фиксируется в момент клика и передаётся
 * родителю после анимации исчезания.
 */
export function ConfirmDialog({
                                  title,
                                  message,
                                  confirmLabel,
                                  cancelLabel,
                                  onConfirm,
                                  onCancel,
                              }: ConfirmDialogProps): ReactNode {
    const [outcome, setOutcome] = useState<'confirm' | 'cancel' | null>(null);

    return (
        <Dialog ariaLabel={title} onClose={() => {
            if (outcome === 'confirm') {
                onConfirm();
            } else {
                onCancel();
            }
        }}>
            {(close) => (
                <>
                    <h2 className={styles.title}>{title}</h2>
                    <p className={styles.message}>{message}</p>
                    <div className={styles.actions}>
                        <Button
                            variant="ghost"
                            onClick={() => {
                                setOutcome('cancel');
                                close();
                            }}
                        >
                            {cancelLabel}
                        </Button>
                        <Button
                            variant="danger"
                            onClick={() => {
                                setOutcome('confirm');
                                close();
                            }}
                        >
                            {confirmLabel}
                        </Button>
                    </div>
                </>
            )}
        </Dialog>
    );
}
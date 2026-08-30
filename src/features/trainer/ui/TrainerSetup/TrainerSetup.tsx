import type {ReactNode} from 'react';
import {useState} from 'react';
import type {KanaAlphabet, KanaColumn, KanaRow} from '@/entities/kana';
import {ALPHABET_KEYS} from '@/entities/kana';
import {pluralRu, useI18n} from '@/shared/lib/i18n';
import {Button, Card, SegmentedControl, TextInput} from '@/shared/ui';
import {MODE_KEYS, REPETITION_MAX, REPETITION_MIN, TRAINING_MODES,} from '../../model/types';
import type {TrainerDraft} from '../../model/useTrainingSession';
import {SymbolPicker} from '../SymbolPicker/SymbolPicker';
import styles from './TrainerSetup.module.css';

interface TrainerSetupProps {
    readonly draft: TrainerDraft;
    readonly selectedCount: number;
    readonly canStart: boolean;
    readonly onAlphabetsChange: (alphabets: readonly KanaAlphabet[]) => void;
    readonly onSetChange: (set: TrainerDraft['set']) => void;
    readonly onModeChange: (mode: TrainerDraft['mode']) => void;
    readonly onRepetitionsChange: (value: number) => void;
    readonly onToggleSymbol: (id: string) => void;
    readonly onSetRow: (alphabet: KanaAlphabet, row: KanaRow, selected: boolean) => void;
    readonly onSetColumn: (alphabet: KanaAlphabet, column: KanaColumn, selected: boolean) => void;
    readonly onSetAll: (alphabet: KanaAlphabet, selected: boolean) => void;
    readonly onStart: () => void;
    readonly onResetProgress: () => void;
}

/** Экран подготовки тренировки: настройка азбук, знаков, режима и повторений. */
export function TrainerSetup({
                                 draft,
                                 selectedCount,
                                 canStart,
                                 onAlphabetsChange,
                                 onSetChange,
                                 onModeChange,
                                 onRepetitionsChange,
                                 onToggleSymbol,
                                 onSetRow,
                                 onSetColumn,
                                 onSetAll,
                                 onStart,
                                 onResetProgress,
                             }: TrainerSetupProps): ReactNode {
    const {t} = useI18n();
    // Локальная строка повторений с валидацией на отправку.
    const [repetitionsText, setRepetitionsText] = useState<string>(String(draft.repetitions));

    const applyRepetitions = (text: string): void => {
        setRepetitionsText(text);
        const parsed = Number(text);
        if (Number.isInteger(parsed) && parsed >= REPETITION_MIN && parsed <= REPETITION_MAX) {
            onRepetitionsChange(parsed);
        }
    };

    const alphabetOptions = (
        ['hiragana', 'katakana'] as const
    ).map((alphabet) => ({value: alphabet, label: t(ALPHABET_KEYS[alphabet])}));

    const modeOptions = TRAINING_MODES.map((mode) => ({
        value: mode,
        label: t(MODE_KEYS[mode]),
    }));

    return (
        <form
            className={styles.form}
            onSubmit={(event) => {
                event.preventDefault();
                onStart();
            }}
        >
            <Card className={styles.card}>
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>{t('setup.alphabet')}</h2>
                    <SegmentedControl
                        ariaLabel={t('setup.alphabetAria')}
                        multiple
                        value={draft.alphabets}
                        options={alphabetOptions}
                        onChange={(value) => {
                            const next = draft.alphabets.includes(value)
                                ? draft.alphabets.filter((item) => item !== value)
                                : [...draft.alphabets, value];
                            // Не даём снять последнюю азбуку — всегда остаётся хотя бы одна.
                            onAlphabetsChange(next.length > 0 ? next : draft.alphabets);
                        }}
                    />
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>{t('setup.symbols')}</h2>
                    <SymbolPicker
                        alphabets={draft.alphabets}
                        set={draft.set}
                        selectedIds={draft.symbolIds}
                        onSetChange={onSetChange}
                        onToggleSymbol={onToggleSymbol}
                        onSetRow={onSetRow}
                        onSetColumn={onSetColumn}
                        onSetAll={onSetAll}
                    />
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>{t('setup.mode')}</h2>
                    <SegmentedControl
                        ariaLabel={t('setup.modeAria')}
                        value={draft.mode}
                        options={modeOptions}
                        onChange={onModeChange}
                    />
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>{t('setup.repetitions')}</h2>
                    <div className={styles.repetitionRow}>
                        <TextInput
                            ariaLabel={t('setup.repetitionsAria')}
                            inputMode="numeric"
                            value={repetitionsText}
                            onChange={applyRepetitions}
                        />
                        <span className={styles.rowHint}>
              {t('setup.repetitionsHint', {min: REPETITION_MIN, max: REPETITION_MAX})}
            </span>
                    </div>
                </section>
            </Card>

            <footer className={styles.footer}>
                <Button type="submit" size="lg" disabled={!canStart}>
                    {t('setup.start')}
                    {canStart
                        ? ` (${selectedCount} ${pluralRu(
                            selectedCount,
                            t('num.signOne'),
                            t('num.signFew'),
                            t('num.signMany'),
                        )})`
                        : ''}
                </Button>
                {!canStart && <span className={styles.footHint}>{t('setup.signHint')}</span>}
                <span className={styles.footerSpacer}/>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                        if (window.confirm(t('setup.resetConfirm'))) {
                            onResetProgress();
                        }
                    }}
                >
                    {t('setup.reset')}
                </Button>
            </footer>
        </form>
    );
}
import type {ReactNode} from 'react';
import {useState} from 'react';
import type {KanaAlphabet, KanaColumn, KanaRow} from '@/entities/kana';
import {ALPHABET_KEYS} from '@/entities/kana';
import {pluralRu, useI18n} from '@/shared/lib/i18n';
import {Button, Card, SegmentedControl, TextInput} from '@/shared/ui';
import {
    MODE_KEYS,
    REPETITION_MAX,
    REPETITION_MIN,
    TIME_LIMIT_CUSTOM_DEFAULT,
    TIME_LIMIT_CUSTOM_MAX,
    TIME_LIMIT_CUSTOM_MIN,
    TIME_LIMIT_KEYS,
    TIME_LIMIT_OPTIONS,
    TRAINING_MODES,
    timeLimitFromOption,
    timeLimitToOption,
    type AnswerTimeLimit,
} from '../../model/types';
import type {TrainerDraft} from '@/features/trainer';
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
    readonly onTimeLimitChange: (limit: AnswerTimeLimit) => void;
    readonly onToggleSymbol: (id: string) => void;
    readonly onSetRow: (alphabet: KanaAlphabet, row: KanaRow, selected: boolean) => void;
    readonly onSetColumn: (alphabet: KanaAlphabet, column: KanaColumn, selected: boolean) => void;
    readonly onSetAll: (alphabet: KanaAlphabet, selected: boolean) => void;
    readonly onStart: () => void;
    readonly onResetProgress: () => void;
}

/** Экран подготовки тренировки: настройка азбук, знаков, режима, повторений и лимита времени. */
export function TrainerSetup({
                                 draft,
                                 selectedCount,
                                 canStart,
                                 onAlphabetsChange,
                                 onSetChange,
                                 onModeChange,
                                 onRepetitionsChange,
                                 onTimeLimitChange,
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
    // Пользовательский лимит: текст поля и последнее корректное значение в секундах.
    const [customText, setCustomText] = useState<string>(String(TIME_LIMIT_CUSTOM_DEFAULT));
    const [customSeconds, setCustomSeconds] = useState<number>(TIME_LIMIT_CUSTOM_DEFAULT);

    const applyRepetitions = (text: string): void => {
        setRepetitionsText(text);
        const parsed = Number(text);
        if (Number.isInteger(parsed) && parsed >= REPETITION_MIN && parsed <= REPETITION_MAX) {
            onRepetitionsChange(parsed);
        }
    };

    const applyCustomLimit = (text: string): void => {
        setCustomText(text);
        const parsed = Number(text);
        if (
            Number.isInteger(parsed) &&
            parsed >= TIME_LIMIT_CUSTOM_MIN &&
            parsed <= TIME_LIMIT_CUSTOM_MAX
        ) {
            setCustomSeconds(parsed);
            if (draft.timeLimit.kind === 'custom') {
                onTimeLimitChange({kind: 'custom', seconds: parsed});
            }
        }
    };

    const alphabetOptions = (
        ['hiragana', 'katakana'] as const
    ).map((alphabet) => ({value: alphabet, label: t(ALPHABET_KEYS[alphabet])}));

    const modeOptions = TRAINING_MODES.map((mode) => ({
        value: mode,
        label: t(MODE_KEYS[mode]),
    }));

    const timeLimitOptions = TIME_LIMIT_OPTIONS.map((option) => ({
        value: option,
        label: t(TIME_LIMIT_KEYS[option]),
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
                    <h2 className={styles.sectionTitle}>{t('setup.timeLimit')}</h2>
                    <SegmentedControl
                        ariaLabel={t('setup.timeLimitAria')}
                        value={timeLimitToOption(draft.timeLimit)}
                        options={timeLimitOptions}
                        onChange={(option) => onTimeLimitChange(timeLimitFromOption(option, customSeconds))}
                    />
                    {draft.timeLimit.kind === 'custom' && (
                        <div className={styles.repetitionRow}>
                            <TextInput
                                ariaLabel={t('setup.timeLimitCustomAria')}
                                inputMode="numeric"
                                value={customText}
                                onChange={applyCustomLimit}
                            />
                            <span className={styles.rowHint}>
                {t('setup.timeLimitHint', {
                    min: TIME_LIMIT_CUSTOM_MIN,
                    max: TIME_LIMIT_CUSTOM_MAX,
                })}
              </span>
                        </div>
                    )}
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
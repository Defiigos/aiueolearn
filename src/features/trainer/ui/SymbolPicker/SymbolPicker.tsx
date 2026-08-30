import type {ReactNode} from 'react';
import type {KanaAlphabet, KanaColumn, KanaRow, KanaSet, KanaSymbol} from '@/entities/kana';
import {COLUMN_LABELS, COLUMN_ORDER, getKanaBySet, ROW_LABELS, ROW_ORDER, SET_KEYS,} from '@/entities/kana';
import {getMasteryLevel, useProgress} from '@/entities/progress';
import {useI18n} from '@/shared/lib/i18n';
import {SegmentedControl} from '@/shared/ui';
import {cx} from '@/shared/lib/cx';
import styles from './SymbolPicker.module.css';

const COLUMN_TEMPLATE = `2.25rem repeat(${COLUMN_ORDER.length}, 1fr)`;

interface SymbolPickerProps {
    readonly alphabets: readonly KanaAlphabet[];
    readonly set: KanaSet;
    readonly selectedIds: ReadonlySet<string>;
    readonly onSetChange: (set: KanaSet) => void;
    readonly onToggleSymbol: (id: string) => void;
    readonly onSetRow: (alphabet: KanaAlphabet, row: KanaRow, selected: boolean) => void;
    readonly onSetColumn: (alphabet: KanaAlphabet, column: KanaColumn, selected: boolean) => void;
    readonly onSetAll: (alphabet: KanaAlphabet, selected: boolean) => void;
}

/** Проверяет, что каждый знак списка выбран. */
function allSelected(ids: ReadonlySet<string>, symbols: readonly KanaSymbol[]): boolean {
    return symbols.length > 0 && symbols.every((symbol) => ids.has(symbol.id));
}

/** Набор кликабельных данных знака (используется и в сетке, и для «знаков вне таблицы»). */
function SymbolCell({
                        symbol,
                        selected,
                        onToggle,
                        className,
                    }: {
    readonly symbol: KanaSymbol;
    readonly selected: boolean;
    readonly onToggle: (id: string) => void;
    readonly className?: string;
}): ReactNode {
    const {progress} = useProgress();
    return (
        <button
            type="button"
            className={cx(styles.cell, selected && styles.cellActive, className)}
            onClick={() => onToggle(symbol.id)}
        >
            <span className={styles.glyph}>{symbol.symbol}</span>
            <span className={styles.reading}>{symbol.romaji}</span>
            <span
                className={cx(styles.dot, styles[`dot--${getMasteryLevel(progress[symbol.id])}`])}
                aria-hidden="true"
            />
        </button>
    );
}

interface GridProps {
    readonly alphabet: KanaAlphabet;
    readonly set: KanaSet;
    readonly selectedIds: ReadonlySet<string>;
    readonly onToggleSymbol: (id: string) => void;
    readonly onSetRow: (alphabet: KanaAlphabet, row: KanaRow, selected: boolean) => void;
    readonly onSetColumn: (alphabet: KanaAlphabet, column: KanaColumn, selected: boolean) => void;
    readonly onSetAll: (alphabet: KanaAlphabet, selected: boolean) => void;
}

/** Таблица одного набора одной азбуки: строки и колонки выбираются кликом. */
function KanaSetGrid({
                         alphabet,
                         set,
                         selectedIds,
                         onToggleSymbol,
                         onSetRow,
                         onSetColumn,
                         onSetAll,
                     }: GridProps): ReactNode {
    const {t} = useI18n();
    const symbols = getKanaBySet(alphabet, set);
    const rows = ROW_ORDER[set];
    const orphans = symbols.filter((symbol) => symbol.column === null);

    // Заголовок: угол «все» + заголовки колонок.
    const header = (
        <div className={styles.gridRow} style={{gridTemplateColumns: COLUMN_TEMPLATE}}>
            <button
                type="button"
                className={cx(styles.corner, allSelected(selectedIds, symbols) && styles.headerActive)}
                onClick={() => onSetAll(alphabet, !allSelected(selectedIds, symbols))}
                title={t('symbols.all')}
            >
                ✓
            </button>
            {COLUMN_ORDER.map((column) => {
                const columnSymbols = symbols.filter((symbol) => symbol.column === column);
                const active = allSelected(selectedIds, columnSymbols);
                return (
                    <button
                        key={column}
                        type="button"
                        className={cx(styles.colHeader, active && styles.headerActive)}
                        onClick={() => onSetColumn(alphabet, column, !active)}
                        title={t('symbols.column')}
                    >
                        {COLUMN_LABELS[column]}
                    </button>
                );
            })}
        </div>
    );

    return (
        <div className={styles.grid}>
            {header}
            {rows.map((row) => {
                const rowSymbols = symbols.filter((symbol) => symbol.row === row);
                if (rowSymbols.length === 0) {
                    return null;
                }
                const rowActive = allSelected(selectedIds, rowSymbols);
                return (
                    <div className={styles.gridRow} style={{gridTemplateColumns: COLUMN_TEMPLATE}} key={row}>
                        <button
                            type="button"
                            className={cx(styles.rowHeader, rowActive && styles.headerActive)}
                            onClick={() => onSetRow(alphabet, row, !rowActive)}
                            title={t('symbols.row')}
                        >
                            {ROW_LABELS[row]}
                        </button>
                        {COLUMN_ORDER.map((column) => {
                            const symbol = rowSymbols.find((candidate) => candidate.column === column);
                            if (!symbol) {
                                return <span key={column} className={styles.emptyCell}/>;
                            }
                            return (
                                <SymbolCell
                                    key={symbol.id}
                                    symbol={symbol}
                                    selected={selectedIds.has(symbol.id)}
                                    onToggle={onToggleSymbol}
                                />
                            );
                        })}
                    </div>
                );
            })}

            {/* Знаки вне таблицы (например ん) */}
            {orphans.map((symbol) => (
                <div className={styles.gridRow} style={{gridTemplateColumns: COLUMN_TEMPLATE}} key={symbol.id}>
                    <span className={styles.rowHeader}/>
                    <SymbolCell
                        symbol={symbol}
                        selected={selectedIds.has(symbol.id)}
                        onToggle={onToggleSymbol}
                    />
                    {COLUMN_ORDER.slice(1).map((column) => (
                        <span key={column} className={styles.emptyCell}/>
                    ))}
                </div>
            ))}
        </div>
    );
}

/** Таблица выбора знаков: переключатель набора + сетки по азбукам. */
export function SymbolPicker({
                                 alphabets,
                                 set,
                                 selectedIds,
                                 onSetChange,
                                 onToggleSymbol,
                                 onSetRow,
                                 onSetColumn,
                                 onSetAll,
                             }: SymbolPickerProps): ReactNode {
    const {progress} = useProgress();
    const {t} = useI18n();

    const visibleSymbols = alphabets.flatMap((alphabet) => getKanaBySet(alphabet, set));
    const masteredCount = visibleSymbols.filter(
        (symbol) => getMasteryLevel(progress[symbol.id]) === 'mastered',
    ).length;

    const setOptions = (Object.keys(SET_KEYS) as KanaSet[]).map((value) => ({
        value,
        label: t(SET_KEYS[value]),
    }));

    return (
        <div className={styles.wrapper}>
            <div className={styles.toolbar}>
                <SegmentedControl
                    ariaLabel={t('common.chooseKanaSet')}
                    value={set}
                    options={setOptions}
                    onChange={onSetChange}
                />
                <span className={styles.progressSummary}>
          {t('symbols.progress', {mastered: masteredCount, total: visibleSymbols.length})}
        </span>
            </div>

            <ul className={styles.legend}>
                <li className={styles.legendItem}>
                    <span className={cx(styles.legendDot, styles['dot--new'])} aria-hidden="true"/>{' '}
                    {t('symbols.legend.new')}
                </li>
                <li className={styles.legendItem}>
                    <span className={cx(styles.legendDot, styles['dot--learning'])} aria-hidden="true"/>{' '}
                    {t('symbols.legend.learning')}
                </li>
                <li className={styles.legendItem}>
                    <span className={cx(styles.legendDot, styles['dot--practiced'])} aria-hidden="true"/>{' '}
                    {t('symbols.legend.practiced')}
                </li>
                <li className={styles.legendItem}>
                    <span className={cx(styles.legendDot, styles['dot--mastered'])} aria-hidden="true"/>{' '}
                    {t('symbols.legend.mastered')}
                </li>
            </ul>

            {alphabets.map((alphabet) => (
                <KanaSetGrid
                    key={alphabet}
                    alphabet={alphabet}
                    set={set}
                    selectedIds={selectedIds}
                    onToggleSymbol={onToggleSymbol}
                    onSetRow={onSetRow}
                    onSetColumn={onSetColumn}
                    onSetAll={onSetAll}
                />
            ))}
        </div>
    );
}
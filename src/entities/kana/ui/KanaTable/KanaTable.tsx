import type {ReactNode} from 'react';
import type {KanaAlphabet, KanaColumn, KanaSet, KanaSymbol,} from '@/entities/kana';
import {ALPHABET_KEYS, COLUMN_LABELS, getKanaBySet, ROW_LABELS, ROW_ORDER, SET_KEYS} from '@/entities/kana';
import {useI18n} from '@/shared/lib/i18n';
import styles from './KanaTable.module.css';

interface KanaTableProps {
    readonly alphabet: KanaAlphabet;
    readonly set: KanaSet;
    /** Колонки, которые есть в наборе (у ёона их три: a, u, o). */
    readonly columns: readonly KanaColumn[];
}

/**
 * Таблица знаков одного набора одной азбуки. Каждая ячейка показывает
 * глиф, ромадзи и русскую транскрипцию. Заголовки строк и колонок — годзюон.
 */
export function KanaTable({alphabet, set, columns}: KanaTableProps): ReactNode {
    const {t, locale} = useI18n();
    const symbols = getKanaBySet(alphabet, set);
    const rows = ROW_ORDER[set];
    const orphans = symbols.filter((symbol) => symbol.column === null);

    const rowCell = (symbol: KanaSymbol | undefined, key: string): ReactNode => {
        if (!symbol) {
            return <td key={key} className={styles.empty} aria-hidden="true"/>;
        }
        return (
            <td key={symbol.id} className={styles.cell}>
                <span className={styles.glyph}>{symbol.symbol}</span>
                <span className={styles.romaji}>{symbol.romaji}</span>
                {locale === 'ru' && <span className={styles.reading}>{symbol.ru}</span>}
            </td>
        );
    };

    return (
        <div className={styles.tableWrapper}>
            <table className={styles.table}>
                <caption className={styles.caption}>
                    {t(SET_KEYS[set])} · {t(ALPHABET_KEYS[alphabet])}
                </caption>
                <thead>
                <tr>
                    <th className={styles.corner} scope="col"/>
                    {columns.map((column) => (
                        <th key={column} scope="col">
                            {COLUMN_LABELS[column]}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {rows.map((row) => {
                    const rowSymbols = symbols.filter((symbol) => symbol.row === row);
                    if (rowSymbols.length === 0) {
                        return null;
                    }
                    return (
                        <tr key={row}>
                            <th className={styles.rowHead} scope="row">
                                {ROW_LABELS[row]}
                            </th>
                            {columns.map((column) =>
                                rowCell(
                                    rowSymbols.find((symbol) => symbol.column === column),
                                    `${row}-${column}`,
                                ),
                            )}
                        </tr>
                    );
                })}

                {/* Знаки вне таблицы (например ん в базовом наборе) */}
                {orphans.map((symbol) => (
                    <tr key={symbol.id}>
                        <th className={styles.rowHead} scope="row"/>
                        {rowCell(symbol, symbol.id)}
                        {columns.slice(1).map((column) => (
                            <td key={column} className={styles.empty} aria-hidden="true"/>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
import type {ReactNode} from 'react';
import styles from './KanaGlyph.module.css';

interface KanaGlyphProps {
    readonly char: string;
    readonly size?: 'sm' | 'md' | 'lg' | 'xl';
}

/** Крупный глиф каны со специальным шрифтом. */
export function KanaGlyph({char, size = 'md'}: KanaGlyphProps): ReactNode {
    return <span className={styles[size]}>{char}</span>;
}
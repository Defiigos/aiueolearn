import type {ReactNode} from 'react';
import {useState} from 'react';
import type {KanaAlphabet, KanaSet} from '@/entities/kana';
import {ALPHABET_KEYS, columnsForSet, KanaTable, SET_KEYS, SET_ORDER,} from '@/entities/kana';
import type {MessageKey} from '@/shared/lib/i18n';
import {useI18n} from '@/shared/lib/i18n';
import {SegmentedControl} from '@/shared/ui';
import styles from './ReferencePage.module.css';

/** Ключи сообщений для справочного текста по каждому набору знаков. */
const SET_MSG_KEYS: Record<KanaSet, { readonly summary: MessageKey; readonly detail: MessageKey }> = {
    base: {summary: 'reference.baseSummary', detail: 'reference.baseDetail'},
    dakuon: {summary: 'reference.dakuonSummary', detail: 'reference.dakuonDetail'},
    yoon: {summary: 'reference.yoonSummary', detail: 'reference.yoonDetail'},
};

/** Ключи сообщений для краткого описания двух азбук. */
const ALPHABET_MSG_KEYS: Record<KanaAlphabet, MessageKey> = {
    hiragana: 'reference.hiraganaIntro',
    katakana: 'reference.katakanaIntro',
};

/** Справка и таблица одного набора для обеих азбук. */
function ReferenceSet({set}: { readonly set: KanaSet }): ReactNode {
    const {t} = useI18n();
    const info = SET_MSG_KEYS[set];

    return (
        <section className={styles.setBlock}>
            <header className={styles.setHeader}>
                <h2 className={styles.setTitle}>{t(SET_KEYS[set])}</h2>
                <p className={styles.setSummary}>{t(info.summary)}</p>
            </header>

            <div className={styles.alphabetCards}>
                {(['hiragana', 'katakana'] as const).map((alphabet) => (
                    <div className={styles.alphabetCard} key={alphabet}>
                        <h3 className={styles.alphabetTitle}>{t(ALPHABET_KEYS[alphabet])}</h3>
                        <p className={styles.alphabetDesc}>{t(ALPHABET_MSG_KEYS[alphabet])}</p>
                        <KanaTable alphabet={alphabet} set={set} columns={columnsForSet(alphabet, set)}/>
                    </div>
                ))}
            </div>

            <p className={styles.setDetail}>{t(info.detail)}</p>
        </section>
    );
}

/** Страница «Азбуки»: справочник по трём наборам знаков обеих азбук. */
export function ReferencePage(): ReactNode {
    const {t} = useI18n();
    const [set, setSet] = useState<KanaSet>('base');

    const setOptions = SET_ORDER.map((value) => ({value, label: t(SET_KEYS[value])}));

    return (
        <div className={styles.page}>
            <header className={styles.intro}>
                <h1 className={styles.heading}>{t('nav.reference')}</h1>
                <p className={styles.lead}>{t('reference.lead')}</p>
            </header>

            <div className={styles.setSelector}>
                <SegmentedControl
                    ariaLabel={t('common.chooseKanaSet')}
                    value={set}
                    options={setOptions}
                    onChange={setSet}
                />
            </div>

            <ReferenceSet set={set}/>
        </div>
    );
}
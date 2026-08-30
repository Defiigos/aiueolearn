import {useCallback, useMemo, useState} from 'react';
import type {KanaAlphabet, KanaColumn, KanaRow, KanaSet, KanaSymbol} from '@/entities/kana';
import {getAllKanaByAlphabets, getKanaByAlphabetsAndSet, getKanaBySet,} from '@/entities/kana';
import {generateQuestions} from './generateQuestions';
import {
    type AnswerStatus,
    DEFAULT_REPETITIONS,
    type QuestionResult,
    type TrainingMode,
    type TrainingQuestion,
} from './types';

/** Выбранные пользователем настройки на экране подготовки. */
export interface TrainerDraft {
    readonly alphabets: readonly KanaAlphabet[];
    /** Набор знаков, видимого в таблице выбора. */
    readonly set: KanaSet;
    readonly symbolIds: ReadonlySet<string>;
    readonly repetitions: number;
    readonly mode: TrainingMode;
}

/** Строит новый Set идентификаторов, отметив/сняв переданный список. */
function applySelection(
    current: ReadonlySet<string>,
    ids: readonly string[],
    selected: boolean,
): ReadonlySet<string> {
    const next = new Set(current);
    for (const id of ids) {
        if (selected) {
            next.add(id);
        } else {
            next.delete(id);
        }
    }
    return next;
}

/**
 * Управляет состоянием экрана подготовки к тренировке.
 * Возвращает текущий проект настроек и контроллеры для его изменения.
 */
export function useTrainerDraft(): {
    readonly draft: TrainerDraft;
    readonly setAlphabets: (alphabets: readonly KanaAlphabet[]) => void;
    readonly setSet: (set: KanaSet) => void;
    readonly setMode: (mode: TrainingMode) => void;
    readonly setRepetitions: (repetitions: number) => void;
    readonly toggleSymbol: (id: string) => void;
    /** Отметить/снять все знаки набора для выбранных азбук. */
    readonly setAllSymbols: (alphabet: KanaAlphabet, selected: boolean) => void;
    /** Отметить/снять всю строку годзюона видимого набора. */
    readonly setRow: (alphabet: KanaAlphabet, row: KanaRow, selected: boolean) => void;
    /** Отметить/снять всю колонку годзюона видимого набора. */
    readonly setColumn: (alphabet: KanaAlphabet, column: KanaColumn, selected: boolean) => void;
    readonly selectedSymbols: readonly KanaSymbol[];
    readonly canStart: boolean;
} {
    const [alphabets, setAlphabetsState] = useState<readonly KanaAlphabet[]>([
        'hiragana',
    ]);
    const [set, setSetState] = useState<KanaSet>('base');
    const [symbolIds, setSymbolIds] = useState<ReadonlySet<string>>(() => {
        return new Set(getKanaByAlphabetsAndSet(['hiragana'], 'base').map((kana) => kana.id));
    });
    const [repetitions, setRepetitionsState] = useState<number>(DEFAULT_REPETITIONS);
    const [mode, setModeState] = useState<TrainingMode>('typing');

    // При смене азбуки по умолчанию отмечаем весь видимый набор новой комбинации.
    const setAlphabets = useCallback(
        (next: readonly KanaAlphabet[]) => {
            setAlphabetsState(next);
            setSymbolIds(new Set(getKanaByAlphabetsAndSet(next, set).map((kana) => kana.id)));
        },
        [set],
    );

    const setSet = useCallback((next: KanaSet) => {
        setSetState(next);
    }, []);

    const setMode = useCallback((next: TrainingMode) => setModeState(next), []);
    const setRepetitions = useCallback((next: number) => setRepetitionsState(next), []);

    const toggleSymbol = useCallback((id: string) => {
        setSymbolIds((current) => {
            const next = new Set(current);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    }, []);

    const setAllSymbols = useCallback(
        (alphabet: KanaAlphabet, selected: boolean) => {
            setSymbolIds((current) => {
                const ids = getKanaBySet(alphabet, set).map((kana) => kana.id);
                return applySelection(current, ids, selected);
            });
        },
        [set],
    );

    const setRow = useCallback(
        (alphabet: KanaAlphabet, row: KanaRow, selected: boolean) => {
            setSymbolIds((current) => {
                const ids = getKanaBySet(alphabet, set)
                    .filter((kana) => kana.row === row)
                    .map((kana) => kana.id);
                return applySelection(current, ids, selected);
            });
        },
        [set],
    );

    const setColumn = useCallback(
        (alphabet: KanaAlphabet, column: KanaColumn, selected: boolean) => {
            setSymbolIds((current) => {
                const ids = getKanaBySet(alphabet, set)
                    .filter((kana) => kana.column === column)
                    .map((kana) => kana.id);
                return applySelection(current, ids, selected);
            });
        },
        [set],
    );

    const selectedSymbols = useMemo(
        () =>
            getAllKanaByAlphabets(alphabets).filter((kana) => symbolIds.has(kana.id)),
        [alphabets, symbolIds],
    );

    const draft: TrainerDraft = {alphabets, set, symbolIds, repetitions, mode};
    const canStart = selectedSymbols.length > 0;

    return {
        draft,
        setAlphabets,
        setSet,
        setMode,
        setRepetitions,
        toggleSymbol,
        setAllSymbols,
        setRow,
        setColumn,
        selectedSymbols,
        canStart,
    };
}

export interface TrainingSessionState {
    readonly index: number;
    readonly total: number;
    readonly question: TrainingQuestion | undefined;
    readonly answered: boolean;
    readonly results: readonly QuestionResult[];
    readonly submitTyping: (romaji: string) => void;
    readonly submitChoice: (symbolId: string) => void;
    readonly next: () => void;
    readonly restart: () => void;
}

/**
 * Управляет ходом активной тренировки: текущий вопрос, проверка ответов,
 * переход к следующему вопросу и перезапуск.
 */
export function useTrainingSession(
    symbols: readonly KanaSymbol[],
    repetitions: number,
    mode: TrainingMode,
    onFinish: (results: readonly QuestionResult[]) => void,
): TrainingSessionState {
    const [runId, setRunId] = useState(0);
    const [index, setIndex] = useState(0);
    const [answered, setAnswered] = useState(false);
    const [results, setResults] = useState<readonly QuestionResult[]>([]);

    const questions = useMemo(
        () => generateQuestions(symbols, repetitions, mode),
        // runId пересоздаёт список вопросов при перезапуске.
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [symbols, repetitions, mode, runId],
    );

    const question = questions[index];
    const total = questions.length;

    const record = useCallback(
        (status: AnswerStatus, submitted: string, correctAnswer: string): void => {
            if (!question || answered) {
                return;
            }
            const result: QuestionResult = {question, status, submitted, correctAnswer};
            setResults((current) => [...current, result]);
            setAnswered(true);
        },
        [question, answered],
    );

    const submitTyping = useCallback(
        (romaji: string): void => {
            if (!question || question.kind !== 'typing') {
                return;
            }
            const status: AnswerStatus =
                question.prompt.romaji === romaji ? 'correct' : 'incorrect';
            record(status, romaji, question.prompt.romaji);
        },
        [question, record],
    );

    const submitChoice = useCallback(
        (symbolId: string): void => {
            if (!question || question.kind !== 'choice') {
                return;
            }
            const status: AnswerStatus =
                question.correct.id === symbolId ? 'correct' : 'incorrect';
            record(status, symbolId, question.correct.romaji);
        },
        [question, record],
    );

    const next = useCallback(() => {
        if (index + 1 >= total) {
            onFinish(results);
            return;
        }
        setAnswered(false);
        setIndex((current) => current + 1);
    }, [index, total, onFinish, results]);

    const restart = useCallback(() => {
        setAnswered(false);
        setIndex(0);
        setResults([]);
        setRunId((current) => current + 1);
    }, []);

    return {
        index,
        total,
        question,
        answered,
        results,
        submitTyping,
        submitChoice,
        next,
        restart,
    };
}
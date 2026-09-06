import {randomInt, shuffle} from '@/shared/lib/random';
import type {KanaSymbol} from '@/entities/kana';
import type {
    ChoiceQuestion,
    RomajiQuestion,
    TrainingMode,
    TrainingQuestion,
    TypingQuestion,
} from './types';

const OPTIONS_COUNT = 4;

function createTypingQuestion(prompt: KanaSymbol, index: number): TypingQuestion {
    return {kind: 'typing', id: `typing_${index}`, prompt};
}

function createChoiceQuestion(
    correct: KanaSymbol,
    pool: readonly KanaSymbol[],
    index: number,
): ChoiceQuestion {
    const candidates = pool.filter((kana) => kana.id !== correct.id);
    const distractors = shuffle(candidates).slice(0, OPTIONS_COUNT - 1);
    const options = shuffle([correct, ...distractors]);

    return {
        kind: 'choice',
        id: `choice_${index}`,
        promptRomaji: correct.romaji,
        options,
        correct,
    };
}

function createRomajiQuestion(
    correct: KanaSymbol,
    pool: readonly KanaSymbol[],
    index: number,
): RomajiQuestion {
    const uniqueRomaji = Array.from(
        new Set(pool.filter((kana) => kana.id !== correct.id).map((kana) => kana.romaji)),
    );
    const distractors = shuffle(uniqueRomaji).slice(0, OPTIONS_COUNT - 1);
    const options = shuffle([correct.romaji, ...distractors]);

    return {
        kind: 'romaji',
        id: `romaji_${index}`,
        prompt: correct,
        options,
        correct: correct.romaji,
    };
}

/**
 * Выбирает пул для отвлекающих вариантов режимов выбора: по возможности весь
 * выбранный пользователем набор, иначе сам набор целиком (для правдоподобия).
 */
function buildChoicePool(symbols: readonly KanaSymbol[]): readonly KanaSymbol[] {
    return symbols.length >= OPTIONS_COUNT ? symbols : [...symbols];
}

/** Для каждого знака решает, вопросам какого типа он будет в смешанном режиме. */
function pickQuestionKind(): Exclude<TrainingMode, 'mixed'> {
    const kind = randomInt(0, 2);
    if (kind === 0) {
        return 'typing';
    }
    return kind === 1 ? 'choice' : 'romaji';
}

/**
 * Генерирует упорядоченный список вопросов тренировки.
 * Каждый знак из пула встречается `repetitions` раз; порядок перемешивается.
 *
 * - «typing» — все вопросы на ввод ромадзи;
 * - «choice» — все вопросы на выбор знака;
 * - «romaji» — все вопросы на выбор ромадзи по знаку;
 * - «mixed» — для каждого знака произвольно выбирается один из трёх типов.
 */
export function generateQuestions(
    symbols: readonly KanaSymbol[],
    repetitions: number,
    mode: TrainingMode,
): readonly TrainingQuestion[] {
    if (symbols.length === 0) {
        return [];
    }

    const repeated: KanaSymbol[] = [];
    for (let i = 0; i < repetitions; i++) {
        repeated.push(...symbols);
    }

    const shuffledSymbols = shuffle(repeated);
    const questions: TrainingQuestion[] = [];

    shuffledSymbols.forEach((symbol, index) => {
        const kind = mode === 'mixed' ? pickQuestionKind() : mode;
        if (kind === 'typing') {
            questions.push(createTypingQuestion(symbol, index));
        } else if (kind === 'choice') {
            questions.push(createChoiceQuestion(symbol, buildChoicePool(symbols), index));
        } else {
            questions.push(createRomajiQuestion(symbol, buildChoicePool(symbols), index));
        }
    });

    return questions;
}
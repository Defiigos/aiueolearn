import {randomInt, shuffle} from '@/shared/lib/random';
import type {KanaSymbol} from '@/entities/kana';
import type {ChoiceQuestion, TrainingMode, TrainingQuestion, TypingQuestion} from './types';

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

/**
 * Выбирает пул для отвлекающих вариантов режима choice: по возможности весь
 * выбранный пользователем набор, иначе сам набор целиком (для правдоподобия).
 */
function buildChoicePool(symbols: readonly KanaSymbol[]): readonly KanaSymbol[] {
    return symbols.length >= OPTIONS_COUNT ? symbols : [...symbols];
}

/** Для каждого знака решает, вопросам какого типа он будет в смешанном режиме. */
function pickQuestionKind(): Exclude<TrainingMode, 'mixed'> {
    return randomInt(0, 1) === 0 ? 'typing' : 'choice';
}

/**
 * Генерирует упорядоченный список вопросов тренировки.
 * Каждый знак из пула встречается `repetitions` раз; порядок перемешивается.
 *
 * - «typing» — все вопросы на ввод ромадзи;
 * - «choice» — все вопросы на выбор знака;
 * - «mixed» — для каждого знака произвольно выбирается один из двух типов.
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
        } else {
            questions.push(createChoiceQuestion(symbol, buildChoicePool(symbols), index));
        }
    });

    return questions;
}
import type {KanaSymbol} from '@/entities/kana';
import type {MessageKey} from '@/shared/lib/i18n';

/** Режимы упражнения, доступные в тренажёре. */
export type TrainingMode = 'typing' | 'choice' | 'mixed';

export const TRAINING_MODES: readonly TrainingMode[] = ['typing', 'choice', 'mixed'];

/**
 * Ключи сообщений интерфейса для подписей режимов тренировки.
 * Сами строки живут в словаре локализации (shared/lib/i18n).
 */
export const MODE_KEYS: Record<TrainingMode, MessageKey> = {
    typing: 'mode.typing',
    choice: 'mode.choice',
    mixed: 'mode.mixed',
} as const;

/** Состояние ответа пользователя по одному вопросу. */
export type AnswerStatus = 'pending' | 'correct' | 'incorrect';

/** Вопрос тренажёра в режиме «написать ромадзи». */
export interface TypingQuestion {
    readonly kind: 'typing';
    readonly id: string;
    readonly prompt: KanaSymbol;
}

/** Вопрос тренажёра в режиме «выбрать знак» (даётся чтение, на выбор — знаки). */
export interface ChoiceQuestion {
    readonly kind: 'choice';
    readonly id: string;
    readonly promptRomaji: string;
    readonly options: readonly KanaSymbol[];
    readonly correct: KanaSymbol;
}

/** Любой вопрос тренажёра. */
export type TrainingQuestion = TypingQuestion | ChoiceQuestion;

/** Результат прохождения одного вопроса. */
export interface QuestionResult {
    readonly question: TrainingQuestion;
    readonly status: AnswerStatus;
    /** Ответ пользователя (ромадзи или id выбранного знака). */
    readonly submitted: string;
    readonly correctAnswer: string;
}

/** Числовые значения по умолчанию для настроек. */
export const DEFAULT_REPETITIONS = 10;
export const REPETITION_MIN = 1;
export const REPETITION_MAX = 50;
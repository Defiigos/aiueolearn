import type {Locale} from './types';

/**
 * Единый словарь строк интерфейса. Английский — источник списка ключей,
 * русский проверяется типом `Record<MessageKey, …>` на полное совпадение,
 * поэтому оба языка всегда содержат один и тот же набор ключей.
 *
 * Плейсхолдеры вида `{name}` подставляются через `translate(locale, key, params)`.
 */
const en = {
    // —— Шапка / навигация ——
    'app.title': 'AIUEO Learn — Hiragana & Katakana',
    'nav.trainer': 'Trainer',
    'nav.reference': 'Alphabets',
    'nav.aria': 'Main navigation',

    // —— Переключатель темы ——
    'theme.toLight': 'Enable light theme',
    'theme.toDark': 'Enable dark theme',
    'theme.currentLight': 'Light theme',
    'theme.currentDark': 'Dark theme',

    // —— Переключатель языка ——
    'lang.switch': 'Switch language',

    // —— Режимы тренажёра ——
    'mode.typing': 'Type the romaji',
    'mode.choice': 'Pick a kana',
    'mode.mixed': 'Mixed',

    // —— Лимит времени на ответ ——
    'timeLimit.off': 'No limit',
    'timeLimit.easy': 'Easy · 30 sec',
    'timeLimit.medium': 'Medium · 10 sec',
    'timeLimit.hard': 'Hard · 2 sec',
    'timeLimit.custom': 'Custom',

    // —— Наборы знаков ——
    'set.base': 'Basic',
    'set.dakuon': 'Voiced',
    'set.yoon': 'Yōon',

    // —— Экран настройки ——
    'setup.alphabet': 'Alphabet',
    'setup.symbols': 'Kana',
    'setup.mode': 'Mode',
    'setup.repetitions': 'Repetitions',
    'setup.alphabetAria': 'Choose the alphabet',
    'setup.modeAria': 'Choose the training mode',
    'setup.repetitionsAria': 'Number of repetitions',
    'setup.repetitionsHint': 'from {min} to {max}',
    'setup.timeLimit': 'Time per answer',
    'setup.timeLimitAria': 'Choose the answer time limit',
    'setup.timeLimitCustomAria': 'Custom time limit in seconds',
    'setup.timeLimitHint': 'from {min} to {max} sec',
    'setup.start': 'Start training',
    'setup.signHint': 'Select at least one kana',
    'setup.resetConfirm': 'Reset all learning progress for every kana?',
    'setup.reset': 'Reset progress',
    'common.chooseKanaSet': 'Choose a set of kana',

    // —— Названия азбук ——
    'alphabet.hiragana': 'Hiragana',
    'alphabet.katakana': 'Katakana',

    // —— Числа (множественное число) ——
    'num.signOne': 'kana',
    'num.signFew': 'kana',
    'num.signMany': 'kana',

    // —— Вопрос «выбери знак» ——
    'choice.aria': 'Kana options',

    // —— Обратная связь после ответа ——
    'feedback.correct': 'Correct!',
    'feedback.wrong': 'Incorrect',
    'feedback.timeout': 'Time is up',
    'feedback.timeSpent': 'Time: {time}',
    'feedback.detail': 'Your answer: {submitted} · Correct: {correct}',
    'feedback.next': 'Next kana',
    'feedback.finish': 'Finish',

    // —— Вопрос «напиши ромадзи» ——
    'typing.placeholder': 'e.g. ka',
    'typing.inputAria': 'Romaji of the kana',
    'typing.submit': 'Answer',

    // —— Ход тренировки ——
    'session.step': 'Step {current} of {total}',
    'session.timeLeft': 'Time left: {time}',

    // —— Таблица выбора знаков ——
    'symbols.all': 'Select all kana',
    'symbols.column': 'Select the whole column',
    'symbols.row': 'Select the whole row',
    'symbols.progress': 'Mastered {mastered} of {total}',
    'symbols.legend.new': 'New',
    'symbols.legend.learning': 'Learning',
    'symbols.legend.practiced': 'Practicing',
    'symbols.legend.mastered': 'Mastered',

    // —— Итоги тренировки ——
    'results.title': 'Training complete',
    'results.correct': 'Correct',
    'results.wrong': 'Mistakes',
    'results.accuracy': 'Accuracy',
    'results.totalTime': 'Total time',
    'results.avgTime': 'Avg per kana',
    'results.timeout': 'Timeouts',
    'results.review': 'Worth reviewing',
    'results.trainAgain': 'Train again',
    'results.toSettings': 'Back to settings',

    // —— Страница «Азбуки» ——
    'reference.lead':
        "Japanese has two syllabaries — hiragana and katakana. Each comes in three sets of kana: the basic gojūon, voiced kana (dakuon/handakuon) and yōon. Choose a set below to view its chart. Next to each kana you'll find the Latin transcription (romaji).",
    'reference.baseSummary':
        'The core gojūon — 46 kana. This is where to start: it is the foundation the other groups build on.',
    'reference.baseDetail':
        "Gojūon ('fifty sounds') is the traditional table of the Japanese syllabary. Read it top to bottom by column: first the five vowels あ・い・う・え・お, then the syllables with consonants. The kana ん is the only one that belongs to no column and always stands alone.",
    'reference.dakuonSummary':
        "Voiced kana (dakuon) and 'circle' kana (handakuon) — the same syllables, but voiced: ka → ga, sa → za.",
    'reference.dakuonDetail':
        "Dakuon adds two small strokes ゛ to the top right, 'voicing' the consonant: か「ka」→ が「ga」. Handakuon is a small circle ゜ found only in the は series, turning は「ha」→ ぱ「pa」. Note the pairs し→じ, ち→ぢ, つ→づ, where the reading is the same.",
    'reference.yoonSummary':
        "Yōon ('pillowed' sound) — a kana ending in -i combined with a small ゃ・ゅ・ょ: き + ゃ = きゃ (kya).",
    'reference.yoonDetail':
        "A full -i vowel kana (き, し, ち, …) merges with a small ゃ・ゅ・ょ (ya, yu, yo) into a single syllable: きゃ = kya, しゃ = sha, じゃ = jya. Small kana are written about half the ordinary size and sit low to the right. Yōon has three columns: や, ゆ, よ.",
    'reference.hiraganaIntro':
        'Hiragana — a smooth, rounded alphabet used for Japanese words, grammatical endings and particles.',
    'reference.katakanaIntro':
        'Katakana — an angular alphabet used for loanwords, names, onomatopoeia and emphasis.',
} as const;

/** Тип ключа сообщения, выводимый из английского словаря. */
export type MessageKey = keyof typeof en;

const ru: Record<MessageKey, string> = {
    'nav.trainer': 'Тренажёр',
    'nav.reference': 'Азбуки',
    'nav.aria': 'Основная навигация',

    'app.title': 'AIUEO Learn — хирагана и катакана',

    'theme.toLight': 'Включить светлую тему',
    'theme.toDark': 'Включить тёмную тему',
    'theme.currentLight': 'Светлая тема',
    'theme.currentDark': 'Тёмная тема',

    'lang.switch': 'Переключить язык',

    'mode.typing': 'Написать ромадзи',
    'mode.choice': 'Выбрать знак',
    'mode.mixed': 'Смешанный',

    'timeLimit.off': 'Без лимита',
    'timeLimit.easy': 'Легко · 30 сек',
    'timeLimit.medium': 'Средне · 10 сек',
    'timeLimit.hard': 'Сложно · 2 сек',
    'timeLimit.custom': 'Своё',

    'set.base': 'Базовые',
    'set.dakuon': 'Озвончённые',
    'set.yoon': 'Ёон',

    'setup.alphabet': 'Азбука',
    'setup.symbols': 'Знаки',
    'setup.mode': 'Режим',
    'setup.repetitions': 'Повторения',
    'setup.alphabetAria': 'Выбор азбуки',
    'setup.modeAria': 'Выбор режима тренировки',
    'setup.repetitionsAria': 'Количество повторений',
    'setup.repetitionsHint': 'от {min} до {max}',
    'setup.timeLimit': 'Время на ответ',
    'setup.timeLimitAria': 'Выбор лимита времени на ответ',
    'setup.timeLimitCustomAria': 'Свой лимит времени, в секундах',
    'setup.timeLimitHint': 'от {min} до {max} сек',
    'setup.start': 'Начать тренировку',
    'setup.signHint': 'Выберите хотя бы один знак',
    'setup.resetConfirm': 'Сбросить весь прогресс изучения по всем знакам?',
    'setup.reset': 'Сбросить прогресс',
    'common.chooseKanaSet': 'Выбор набора знаков',

    'alphabet.hiragana': 'Хирагана',
    'alphabet.katakana': 'Катакана',

    'num.signOne': 'знак',
    'num.signFew': 'знака',
    'num.signMany': 'знаков',

    'choice.aria': 'Варианты знаков',

    'feedback.correct': 'Верно!',
    'feedback.wrong': 'Неверно',
    'feedback.timeout': 'Время вышло',
    'feedback.timeSpent': 'Время: {time}',
    'feedback.detail': 'Ваш ответ: {submitted} · Правильно: {correct}',
    'feedback.next': 'Следующий знак',
    'feedback.finish': 'Завершить',

    'typing.placeholder': 'Например: ka',
    'typing.inputAria': 'Ромадзи знака',
    'typing.submit': 'Ответить',

    'session.step': 'Шаг {current} из {total}',
    'session.timeLeft': 'Осталось: {time}',

    'symbols.all': 'Выбрать все знаки',
    'symbols.column': 'Выбрать всю колонку',
    'symbols.row': 'Выбрать всю строку',
    'symbols.progress': 'Освоено {mastered} из {total}',
    'symbols.legend.new': 'Новый',
    'symbols.legend.learning': 'Учу',
    'symbols.legend.practiced': 'Практикую',
    'symbols.legend.mastered': 'Освоен',

    'results.title': 'Тренировка завершена',
    'results.correct': 'Правильно',
    'results.wrong': 'Ошибки',
    'results.accuracy': 'Точность',
    'results.totalTime': 'Общее время',
    'results.avgTime': 'Среднее на знак',
    'results.timeout': 'Тайм-ауты',
    'results.review': 'Стоит повторить',
    'results.trainAgain': 'Тренироваться ещё',
    'results.toSettings': 'В настройки',

    'reference.lead':
        'В японском две слоговые азбуки — хирагана и катакана. У каждой по три набора знаков: основной годзюон, озвончённые (дакуон/хандакуон) и ёон. Выберите набор ниже, чтобы увидеть таблицу. Рядом с каждым знаком — латинская транскрипция (ромадзи) и примерное русское произношение.',
    'reference.baseSummary':
        'Основной годзюон — 46 знаков. С него стоит начинать: это фундамент, из которого строятся остальные группы.',
    'reference.baseDetail':
        'Годзюон («пятьдесят звуков») — традиционная таблица японской слоговой азбуки. Читается сверху вниз по столбцам: сначала пять гласных あ・い・う・え・お, затем слоги с согласными. Знак ん — единственный, который не входит ни в один столбец и всегда стоит отдельно.',
    'reference.dakuonSummary':
        'Озвончённые знаки (дакуон) и знаки с «кружком» (хандакуон) — те же слоги, но звонкие: ка → га, са → дза.',
    'reference.dakuonDetail':
        'Дакуон — добавление двух чёрточек ゛ сверху справа, которое «озвончает» согласный звук: か「ка」→ が「га」. Хандакуон — маленький кружок ゜, который встречается только у серии は и превращает は「ха」→ ぱ「па」. Обратите внимание на пары し→じ, ち→ぢ, つ→づ, где чтение совпадает (си→дзи).',
    'reference.yoonSummary':
        'Ёон («смягчение» звука) — сочетания знаков на -и с малыми ゃ・ゅ・ょ: き + ゃ = きゃ (кя).',
    'reference.yoonDetail':
        'Большой знак на гласную -и (き, し, ち, …) сливается с маленьким ゃ・ゅ・ょ (ya, yu, yo), образуя один слог: きゃ = кя, しゃ = ся, じゃ = дзя. Маленькие знаки пишутся вдвое меньше обычных и добавляются внизу-слегка. У ёона три столбца: я, ю, ё.',
    'reference.hiraganaIntro':
        'Хирагана — плавная, «округлая» азбука. Используется для японских слов, грамматических окончаний и служебных частиц.',
    'reference.katakanaIntro':
        'Катакана — угловатая азбука. Используется для заимствованных слов, имён, звукоподражаний и выделения.',
};

/** Словарь сообщений по всем поддерживаемым языкам. */
export const messages: Record<Locale, Record<MessageKey, string>> = {en, ru};

/**
 * Русское множественное число: 1 знак, 2 знака, 5 знаков.
 * Возвращает форму `one` / `few` / `many` по правилам русского языка.
 */
export function pluralRu(count: number, one: string, few: string, many: string): string {
    const n = Math.abs(count) % 100;
    const n10 = n % 10;
    if (n > 10 && n < 20) {
        return many;
    }
    if (n10 > 1 && n10 < 5) {
        return few;
    }
    if (n10 === 1) {
        return one;
    }
    return many;
}
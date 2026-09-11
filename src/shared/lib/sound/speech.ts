/**
 * Озвучивание произношения знаков через браузерный речевой синтез (Web Speech API).
 * Использует `window.speechSynthesis` и `SpeechSynthesisUtterance` из стандартных
 * типов DOM; при недоступности синтезатора молча выходит (речь не критична).
 */

/** Язык озвучивания — японский. */
const JAPANESE_LOCALE = 'ja-JP';

/** Умеренный темп речи (1.0 — обычный). */
const SPEECH_RATE = 0.9;

/**
 * Озвучивает переданный текст по-японски. Синтезатор недоступен или
 * возникла ошибка — молча выходим.
 */
export function speakJapanese(text: string): void {
    if (typeof text !== 'string' || text.length === 0) {
        return;
    }
    if (typeof window === 'undefined') {
        return;
    }
    const synth = window.speechSynthesis;
    if (!synth || typeof synth.speak !== 'function') {
        return;
    }
    try {
        // Сбрасываем очередь, чтобы быстрое переключение знаков не накапливало речь.
        if (typeof synth.cancel === 'function') {
            synth.cancel();
        }
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = JAPANESE_LOCALE;
        utterance.rate = SPEECH_RATE;
        synth.speak(utterance);
    } catch {
        // Синтезатор может быть недоступен без голосов или в приватном режиме.
    }
}
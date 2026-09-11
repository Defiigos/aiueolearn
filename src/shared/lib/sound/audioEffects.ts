/**
 * Звуковые эффекты интерфейса, синтезированные через WebAudio.
 * Короткие тоны строятся на лету осциллятором AudioContext.
 * Контекст создаётся лениво при первом воспроизведении.
 */

/** Тип одного тона в последовательности. */
interface Tone {
    readonly freq: number;
    readonly startMs: number;
    readonly durMs: number;
    /** Громкость 0…1 (по умолчанию 0.18). */
    readonly volume?: number;
    /** Форма волны (по умолчанию sine). */
    readonly type?: OscillatorType;
}

/** Окно с браузерными расширениями конструктора звукового контекста. */
interface AudioWindow extends Window {
    readonly AudioContext?: typeof AudioContext;
    readonly webkitAudioContext?: typeof AudioContext;
}

let audioContext: AudioContext | null = null;

/** Лениво создаёт единственный AudioContext приложения (или null, если аудио недоступно). */
function ensureContext(): AudioContext | null {
    if (audioContext !== null) {
        return audioContext;
    }
    if (typeof window === 'undefined') {
        return null;
    }
    const win = window as AudioWindow;
    const Ctor = win.AudioContext ?? win.webkitAudioContext;
    if (!Ctor) {
        return null;
    }
    try {
        audioContext = new Ctor();
    } catch {
        return null;
    }
    return audioContext;
}

/** Возобновляет приостановленный контекст (Chrome приостанавливает аудио без звука). */
function resumeIfNeeded(ctx: AudioContext): void {
    try {
        if (ctx.state === 'suspended' && typeof ctx.resume === 'function') {
            void ctx.resume();
        }
    } catch {
        // Контекст может быть уже закрыт — молча пропускаем.
    }
}

/** Проигрывает последовательность тонов с плавными атакой и затуханием (без щелчков). */
function playTones(tones: readonly Tone[]): void {
    const ctx = ensureContext();
    if (!ctx) {
        return;
    }
    resumeIfNeeded(ctx);
    const start = ctx.currentTime;
    for (const {freq, startMs, durMs, volume = 0.18, type = 'sine'} of tones) {
        const startAt = start + startMs / 1000;
        const duration = durMs / 1000;
        const attack = Math.min(0.008, duration * 0.25);
        const release = Math.min(0.03, duration * 0.5);

        const oscillator = ctx.createOscillator();
        const gain = ctx.createGain();
        oscillator.type = type;
        oscillator.frequency.value = freq;

        gain.gain.setValueAtTime(0, startAt);
        gain.gain.linearRampToValueAtTime(volume, startAt + attack);
        gain.gain.linearRampToValueAtTime(volume * 0.7, startAt + duration - release);
        gain.gain.linearRampToValueAtTime(0, startAt + duration);

        oscillator.connect(gain);
        gain.connect(ctx.destination);
        oscillator.start(startAt);
        oscillator.stop(startAt + duration + 0.02);
    }
}

/** Короткий клик при выборе ответа. */
export function playClick(): void {
    playTones([
        {freq: 1500, startMs: 0, durMs: 40, volume: 0.1, type: 'sine'},
    ]);
}

/** Подтверждающий восходящий тон правильного ответа. */
export function playCorrect(): void {
    playTones([
        {freq: 523, startMs: 10, durMs: 140, volume: 0.18},
        {freq: 784, startMs: 120, durMs: 190, volume: 0.18},
    ]);
}

/** Нисходящий тон неверного ответа / тайм-аута. */
export function playIncorrect(): void {
    playTones([
        {freq: 262, startMs: 10, durMs: 150, volume: 0.16, type: 'triangle'},
        {freq: 196, startMs: 130, durMs: 200, volume: 0.15, type: 'triangle'},
    ]);
}
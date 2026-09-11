/** Ключ, под которым настройка звука хранится в localStorage. */
export const SOUND_STORAGE_KEY = 'aiueo.soundEnabled';

/** Звук по умолчанию включён. */
export const SOUND_DEFAULT_ENABLED = true;

/** Читает настройку звука из localStorage; при отсутствии/ошибке — значение по умолчанию. */
export function loadSoundEnabled(): boolean {
    if (typeof window === 'undefined') {
        return SOUND_DEFAULT_ENABLED;
    }
    try {
        const raw = window.localStorage.getItem(SOUND_STORAGE_KEY);
        if (raw === null) {
            return SOUND_DEFAULT_ENABLED;
        }
        return raw === 'true';
    } catch {
        return SOUND_DEFAULT_ENABLED;
    }
}

/** Сохраняет настройку звука в localStorage. Ошибки молча игнорируются. */
export function saveSoundEnabled(enabled: boolean): void {
    if (typeof window === 'undefined') {
        return;
    }
    try {
        window.localStorage.setItem(SOUND_STORAGE_KEY, String(enabled));
    } catch {
        // Хранилище может быть недоступно (например, в приватном режиме).
    }
}
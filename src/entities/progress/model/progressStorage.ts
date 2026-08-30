import type {ProgressMap} from './types';
import {PROGRESS_STORAGE_KEY, sanitizeProgress} from './types';

/** Читает прогресс из localStorage. При ошибке возвращает пустую карту. */
export function loadProgress(): ProgressMap {
    if (typeof window === 'undefined') {
        return {};
    }
    try {
        const raw = window.localStorage.getItem(PROGRESS_STORAGE_KEY);
        return raw ? sanitizeProgress(JSON.parse(raw)) : {};
    } catch {
        return {};
    }
}

/** Сохраняет прогресс в localStorage. Ошибки записи молча игнорируются. */
export function saveProgress(map: ProgressMap): void {
    if (typeof window === 'undefined') {
        return;
    }
    try {
        window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(map));
    } catch {
        // Хранилище может быть недоступно (например, в приватном режиме).
    }
}
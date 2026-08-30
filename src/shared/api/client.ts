import type {ApiResponse} from './types';

/**
 * Лёгкая обёртка над fetch для общения с бэкендом.
 *
 * Пока приложение работает полностью локально и бэкенд отсутствует,
 * поэтому `API_BASE_URL` указывает на заглушку. Когда появится настоящий сервер
 * — достаточно поменять значение константы и описать эндпоинты в `endpoints.ts`.
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

export class ApiError extends Error {
    readonly status?: number;

    constructor(message: string, status?: number) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
    }
}

/**
 * Выполняет GET-запрос к бэкенду и проверяет статус ответа.
 * Гарантированно не возвращает `undefined`: при неудаче кидает `ApiError`.
 */
export async function apiGet<T>(path: string, signal?: AbortSignal): Promise<ApiResponse<T>> {
    let response: Response;
    try {
        response = await fetch(`${API_BASE_URL}${path}`, {signal});
    } catch {
        throw new ApiError('Сеть недоступна');
    }

    if (!response.ok) {
        throw new ApiError(`Сервер ответил статусом ${response.status}`, response.status);
    }

    const payload: ApiResponse<T> = (await response.json()) as ApiResponse<T>;
    return payload;
}
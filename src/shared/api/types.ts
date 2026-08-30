/** Результат запроса к API, который всегда может завершиться ошибкой. */
export interface ApiResult<T> {
    readonly ok: boolean;
    readonly data?: T;
    readonly error?: string;
}

/** Структура ошибки, описанная бэкендом. */
export interface ApiErrorPayload {
    readonly message: string;
    readonly details?: unknown;
}

/** Базовый тип ответа бэкенда. */
export interface ApiResponse<T> {
    readonly data: T;
    readonly meta?: Record<string, unknown>;
}

/** Тип конфигурации запроса: внешние параметры пунктуации. */
export interface ApiRequestOptions {
    readonly signal?: AbortSignal;
}
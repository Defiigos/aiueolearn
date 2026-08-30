import {apiGet} from './client';
import type {ApiResult} from './types';

/**
 * Пример эндпоинта бэкенда. Сюда начнут подсоединяться реальные методы,
 * когда появятся требования вроде «сохранить прогресс на сервере».
 * Сейчас метод реализован как заглушка и демонстрирует контракт слоя API.
 */
export async function getAppStartupInfo(): Promise<ApiResult<string>> {
    try {
        const response = await apiGet<string>('/api/startup');
        return {ok: true, data: response.data};
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Неизвестная ошибка';
        return {ok: false, error: message};
    }
}
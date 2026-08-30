import type {MessageKey} from './messages';
import {messages} from './messages';
import type {Locale} from './types';

/** Параметры подстановки в строку интерфейса. */
export interface TranslateParams {
    readonly [name: string]: string | number;
}

/** Подставляет плейсхолдеры `{name}` в сообщение указанного языка. */
export function translate(locale: Locale, key: MessageKey, params?: TranslateParams): string {
    const template = messages[locale][key];
    if (!params) {
        return template;
    }
    return template.replace(/\{(\w+)\}/g, (match, name: string) => {
        const value = params[name];
        return value === undefined ? match : String(value);
    });
}
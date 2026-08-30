/** Поддерживаемые языки интерфейса. */
export type Locale = 'ru' | 'en';

/** Основной язык приложения — используется, когда системный язык не поддерживается. */
export const DEFAULT_LOCALE: Locale = 'ru';

/** Ключ, под которым выбор языка хранится в localStorage. */
export const LOCALE_STORAGE_KEY = 'aiueo.locale';
export const locales = ["en", "uk", "ru"] as const;
export type TLocale = (typeof locales)[number];

export const DEFAULT_LOCALE: TLocale = "en";

export const LOCALE_COOKIE_NAME = "NEXT_LOCALE";
export const LOCALE_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365; // 1 year

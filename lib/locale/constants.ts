export const LOCALES = {
  EN: "en",
  UK: "uk",
  RU: "ru",
} as const;

export type TLocale = (typeof LOCALES)[keyof typeof LOCALES];

// Ordered list — drives display order in switchers, Drizzle column enum, and validation
export const LOCALE_LIST = [LOCALES.EN, LOCALES.UK, LOCALES.RU] as const;

export const DEFAULT_LOCALE = LOCALES.EN;

export const LOCALE_COOKIE_NAME = "NEXT_LOCALE";
export const LOCALE_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365; // 1 year

export type TLocaleConfig = {
  label: string;
  code: string;
};

export const LOCALE_CONFIG: Record<TLocale, TLocaleConfig> = {
  [LOCALES.EN]: { label: "English", code: "EN" },
  [LOCALES.UK]: { label: "Українська", code: "UA" },
  [LOCALES.RU]: { label: "Русский", code: "RU" },
};

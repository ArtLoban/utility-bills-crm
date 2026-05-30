export const THEMES = {
  LIGHT: "light",
  DARK: "dark",
  SYSTEM: "system",
} as const;

export type TTheme = (typeof THEMES)[keyof typeof THEMES];

// Ordered list — drives validation and Drizzle column enum
export const THEME_LIST = [THEMES.LIGHT, THEMES.DARK, THEMES.SYSTEM] as const;

export const DEFAULT_THEME = THEMES.SYSTEM;

export const THEME_COOKIE_NAME = "NEXT_THEME";
export const THEME_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365; // 1 year

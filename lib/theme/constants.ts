export const themes = ["light", "dark", "system"] as const;
export type TTheme = (typeof themes)[number];

export const DEFAULT_THEME: TTheme = "system";

export const THEME_COOKIE_NAME = "NEXT_THEME";
export const THEME_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365; // 1 year

"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { setTheme as setThemeAction } from "@/lib/theme/actions";
import { THEMES, DEFAULT_THEME, type TTheme } from "@/lib/theme/constants";

type TOption = {
  value: TTheme;
  icon: React.ReactNode;
};

const THEME_OPTIONS: TOption[] = [
  { value: THEMES.LIGHT, icon: <Sun className="size-3.5" /> },
  { value: THEMES.DARK, icon: <Moon className="size-3.5" /> },
  { value: THEMES.SYSTEM, icon: <Monitor className="size-3.5" /> },
];

export const ThemeRadio = () => {
  const { theme, setTheme } = useTheme();
  const t = useTranslations("settings.preferences.theme");
  const activeTheme = theme ?? DEFAULT_THEME;

  const handleSelect = (value: TTheme) => {
    setTheme(value);
    void setThemeAction(value);
  };

  return (
    <div className="flex flex-wrap gap-1.5">
      {THEME_OPTIONS.map((opt) => {
        const active = activeTheme === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => handleSelect(opt.value)}
            className={cn(
              "inline-flex h-9 items-center gap-1.5 rounded-md border px-3.5 text-sm transition-colors duration-100",
              active
                ? "border-foreground bg-foreground text-background font-medium"
                : "border-border bg-card text-muted-foreground hover:bg-muted font-normal",
            )}
          >
            {opt.icon}
            {t(opt.value)}
          </button>
        );
      })}
    </div>
  );
};

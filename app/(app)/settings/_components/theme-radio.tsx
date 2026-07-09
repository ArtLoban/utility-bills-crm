"use client";

import type { ReactNode } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { setTheme as setThemeAction } from "@/lib/theme/actions";
import { THEMES, DEFAULT_THEME, type TTheme } from "@/lib/theme/constants";

type TOption = {
  value: TTheme;
  icon: ReactNode;
};

const THEME_OPTIONS: TOption[] = [
  { value: THEMES.LIGHT, icon: <Sun /> },
  { value: THEMES.DARK, icon: <Moon /> },
  { value: THEMES.SYSTEM, icon: <Monitor /> },
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
          <Button
            key={opt.value}
            type="button"
            variant={active ? "default" : "outline"}
            size="lg"
            onClick={() => handleSelect(opt.value)}
          >
            {opt.icon}
            {t(opt.value)}
          </Button>
        );
      })}
    </div>
  );
};

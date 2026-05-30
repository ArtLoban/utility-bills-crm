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

const OPTIONS: TOption[] = [
  { value: THEMES.LIGHT, icon: <Sun className="size-[14px]" /> },
  { value: THEMES.DARK, icon: <Moon className="size-[14px]" /> },
  { value: THEMES.SYSTEM, icon: <Monitor className="size-[14px]" /> },
];

const ThemeRadio = () => {
  const { theme, setTheme } = useTheme();
  const t = useTranslations("settings.preferences.theme");
  const activeTheme = theme ?? DEFAULT_THEME;

  const handleSelect = (value: TTheme) => {
    setTheme(value);
    void setThemeAction(value);
  };

  return (
    <div className="flex flex-wrap gap-1.5">
      {OPTIONS.map((opt) => {
        const active = activeTheme === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => handleSelect(opt.value)}
            className={cn(
              "inline-flex h-9 items-center gap-1.5 rounded-md border px-[14px] text-sm transition-colors duration-[120ms]",
              active
                ? "border-zinc-950 bg-zinc-950 font-medium text-white dark:border-zinc-50 dark:bg-zinc-50 dark:text-zinc-950"
                : "border-zinc-200 bg-white font-normal text-zinc-500 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800",
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

export { ThemeRadio };

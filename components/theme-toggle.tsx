"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { setTheme as setThemeAction } from "@/lib/theme/actions";
import type { TTheme } from "@/lib/theme/constants";

export const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const t = useTranslations("common.a11y");

  const handleToggle = () => {
    const next: TTheme = resolvedTheme === "dark" ? "light" : "dark";
    setTheme(next);
    void setThemeAction(next);
  };

  return (
    <Button variant="outline" size="icon" aria-label={t("toggleTheme")} onClick={handleToggle}>
      <Sun className="size-4 scale-100 rotate-0 transition-transform dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute size-4 scale-0 rotate-90 transition-transform dark:scale-100 dark:rotate-0" />
    </Button>
  );
};

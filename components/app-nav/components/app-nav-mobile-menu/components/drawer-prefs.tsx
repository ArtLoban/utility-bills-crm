"use client";

import { ChevronRight, Globe, Moon, Sun } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { LOCALE_CONFIG } from "@/lib/locale/constants";
import type { TLocale } from "@/lib/locale/constants";
import { LocaleFlag } from "@/components/locale-flag";

type TProps = {
  onLangOpen: () => void;
};

export const DrawerPrefs = ({ onLangOpen }: TProps) => {
  const { resolvedTheme, setTheme } = useTheme();
  const currentLocale = useLocale();
  const t = useTranslations();
  const localeCode = LOCALE_CONFIG[currentLocale as TLocale]?.code ?? currentLocale.toUpperCase();

  return (
    <div className="px-2.5 py-2">
      <p className="text-muted-foreground px-3 pt-2 pb-1.5 text-xs font-semibold tracking-wider uppercase">
        {t("nav.prefs.title")}
      </p>

      <button
        onClick={onLangOpen}
        className="hover:bg-accent flex h-11 w-full items-center gap-3 rounded-lg px-3 text-left text-sm font-medium transition-colors"
        aria-label={t("nav.prefs.language")}
      >
        <Globe className="text-muted-foreground size-5 shrink-0" />
        <span className="flex-1">{t("nav.prefs.language")}</span>
        <LocaleFlag locale={currentLocale as TLocale} />
        <span className="text-muted-foreground text-xs font-semibold tracking-wide">
          {localeCode}
        </span>
        <ChevronRight className="text-muted-foreground size-4" />
      </button>

      <div className="flex h-11 items-center gap-3 px-3">
        <Sun className="text-muted-foreground size-5 shrink-0" />
        <span className="flex-1 text-sm font-medium">{t("nav.prefs.theme")}</span>
        <div className="bg-muted flex rounded-lg border p-0.5">
          <button
            onClick={() => setTheme("light")}
            aria-label={t("common.a11y.lightTheme")}
            aria-pressed={resolvedTheme === "light"}
            className={cn(
              "flex size-8 items-center justify-center rounded-md transition-all",
              resolvedTheme === "light"
                ? "bg-background shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Sun className="size-3.5" />
          </button>
          <button
            onClick={() => setTheme("dark")}
            aria-label={t("common.a11y.darkTheme")}
            aria-pressed={resolvedTheme === "dark"}
            className={cn(
              "flex size-8 items-center justify-center rounded-md transition-all",
              resolvedTheme === "dark"
                ? "bg-background shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Moon className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

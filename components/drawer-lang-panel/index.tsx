"use client";

import { Check, ChevronLeft } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { LOCALE_CONFIG, getAvailableLocales } from "@/lib/locale/constants";
import type { TLocale } from "@/lib/locale/constants";
import { setLocale } from "@/lib/locale/actions";
import { LocaleFlag } from "@/components/locale-flag";

type TProps = {
  ruEnabled: boolean;
  onBack: () => void;
};

export const DrawerLangPanel = ({ ruEnabled, onBack }: TProps) => {
  const router = useRouter();
  const currentLocale = useLocale();
  const t = useTranslations("nav.langPanel");

  const availableLocales = getAvailableLocales({
    ruEnabled,
    activeLocale: currentLocale as TLocale,
  });

  const handleSelect = async (locale: string) => {
    await setLocale(locale as TLocale);
    router.refresh();
    onBack();
  };

  return (
    <div className="flex-1 overflow-y-auto px-2.5 py-2">
      <button
        onClick={onBack}
        className="hover:bg-accent text-muted-foreground mb-2 flex h-9 items-center gap-1.5 rounded-lg px-2 text-sm font-medium transition-colors"
      >
        <ChevronLeft className="size-4" />
        {t("back")}
      </button>

      <p className="px-3 pb-3 text-[17px] font-semibold tracking-tight">{t("title")}</p>

      {availableLocales.map((locale) => {
        const config = LOCALE_CONFIG[locale];
        const active = locale === currentLocale;

        return (
          <button
            key={locale}
            onClick={() => handleSelect(locale)}
            className={cn(
              "mb-0.5 flex h-13 w-full items-center gap-3.5 rounded-xl px-3 text-left transition-colors",
              active ? "bg-brand-bg" : "hover:bg-accent",
            )}
          >
            <LocaleFlag locale={locale} />
            <div className="flex-1">
              <p className={cn("text-sm", active ? "font-semibold" : "font-medium")}>
                {config.label}
              </p>
              <p className="text-muted-foreground text-xs font-semibold tracking-wider">
                {config.code}
              </p>
            </div>
            {active && (
              <div className="bg-primary flex size-6 items-center justify-center rounded-full">
                <Check className="text-primary-foreground size-3.5" />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};

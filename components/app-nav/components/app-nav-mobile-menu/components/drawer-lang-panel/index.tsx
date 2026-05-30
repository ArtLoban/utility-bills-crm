"use client";

import { Check, ChevronLeft } from "lucide-react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { locales, LOCALE_CONFIG } from "@/lib/locale/constants";
import { setLocale } from "@/lib/locale/actions";
import { LocaleFlag } from "@/components/app-nav/components/locale-flag";

type TProps = {
  onBack: () => void;
};

export const DrawerLangPanel = ({ onBack }: TProps) => {
  const router = useRouter();
  const currentLocale = useLocale();

  const handleSelect = async (locale: string) => {
    await setLocale(locale as Parameters<typeof setLocale>[0]);
    router.refresh();
    onBack();
  };

  return (
    <div className="flex-1 overflow-y-auto px-2.5 py-2">
      <button
        onClick={onBack}
        className="hover:bg-accent text-muted-foreground mb-2 flex h-9 items-center gap-1.5 rounded-lg px-2 text-[13.5px] font-medium transition-colors"
      >
        <ChevronLeft className="size-4" />
        Back
      </button>

      <p className="px-3 pb-3 text-[17px] font-semibold tracking-tight">Choose language</p>

      {locales.map((locale) => {
        const config = LOCALE_CONFIG[locale];
        const active = locale === currentLocale;

        return (
          <button
            key={locale}
            onClick={() => handleSelect(locale)}
            className={cn(
              "mb-0.5 flex h-[52px] w-full items-center gap-3.5 rounded-xl px-3 text-left transition-colors",
              active ? "bg-brand-bg" : "hover:bg-accent",
            )}
          >
            <LocaleFlag locale={locale} />
            <div className="flex-1">
              <p className={cn("text-[15px]", active ? "font-semibold" : "font-medium")}>
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

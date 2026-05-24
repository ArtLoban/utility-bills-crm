"use client";

import { Check, Globe } from "lucide-react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { locales, LOCALE_CONFIG } from "@/lib/locale/constants";
import type { TLocale } from "@/lib/locale/constants";
import { setLocaleCookie } from "@/lib/locale/actions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LocaleFlag } from "./locale-flag";

export const LanguageSwitcher = () => {
  const router = useRouter();
  const currentLocale = useLocale();

  const handleSelect = async (locale: TLocale) => {
    await setLocaleCookie(locale);
    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Switch language"
        className="hover:bg-accent hover:text-accent-foreground inline-flex size-9 items-center justify-center rounded-md outline-none"
      >
        <Globe className="text-muted-foreground size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className="min-w-[220px]">
        <DropdownMenuLabel className="px-3 pt-2.5 pb-2 text-[11px] tracking-wider uppercase">
          Language
        </DropdownMenuLabel>
        {locales.map((locale) => {
          const config = LOCALE_CONFIG[locale];
          const active = locale === currentLocale;
          return (
            <DropdownMenuItem
              key={locale}
              onClick={() => handleSelect(locale)}
              className="h-10 cursor-pointer gap-3 px-3"
            >
              <LocaleFlag locale={locale} />
              <span className={active ? "flex-1 font-semibold" : "flex-1 font-normal"}>
                {config.label}
              </span>
              <span className="text-muted-foreground text-[11.5px] font-semibold tracking-wide">
                {config.code}
              </span>
              {active && <Check className="text-brand size-4" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

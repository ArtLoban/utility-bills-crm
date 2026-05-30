"use client";

import { useRouter } from "next/navigation";
import { LOCALE_LIST, type TLocale } from "@/lib/locale/constants";
import { setLocale } from "@/lib/locale/actions";

export const LocaleSwitcher = () => {
  const router = useRouter();

  const handleLocaleChange = async (locale: TLocale) => {
    await setLocale(locale);
    router.refresh();
  };

  return (
    <div className="flex gap-2">
      {LOCALE_LIST.map((locale) => (
        <button
          key={locale}
          onClick={() => handleLocaleChange(locale)}
          className="text-xs uppercase"
        >
          {locale}
        </button>
      ))}
    </div>
  );
};

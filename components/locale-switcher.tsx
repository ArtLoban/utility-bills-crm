"use client";

import { useRouter } from "next/navigation";
import { locales } from "@/lib/locale/constants";
import { setLocaleCookie } from "@/lib/locale/actions";

export const LocaleSwitcher = () => {
  const router = useRouter();

  const handleLocaleChange = async (locale: string) => {
    await setLocaleCookie(locale);
    router.refresh();
  };

  return (
    <div className="flex gap-2">
      {locales.map((locale) => (
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

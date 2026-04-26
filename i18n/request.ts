import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";
import { locales, DEFAULT_LOCALE, LOCALE_COOKIE_NAME, type TLocale } from "@/lib/locale/constants";

const isValidLocale = (value?: string): value is TLocale => locales.includes(value as TLocale);

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(LOCALE_COOKIE_NAME)?.value;
  const locale = isValidLocale(cookieLocale) ? cookieLocale : DEFAULT_LOCALE;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});

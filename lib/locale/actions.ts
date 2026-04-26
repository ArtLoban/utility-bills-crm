"use server";

import { cookies } from "next/headers";
import { LOCALE_COOKIE_NAME, LOCALE_COOKIE_MAX_AGE_SECONDS } from "@/lib/locale/constants";

export const setLocaleCookie = async (locale: string) => {
  const cookieStore = await cookies();
  cookieStore.set(LOCALE_COOKIE_NAME, locale, {
    path: "/",
    maxAge: LOCALE_COOKIE_MAX_AGE_SECONDS,
  });
};

"use server";

import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db/client";
import { users, type UserId } from "@/lib/db/schema";
import {
  LOCALE_LIST,
  LOCALE_COOKIE_NAME,
  LOCALE_COOKIE_MAX_AGE_SECONDS,
  type TLocale,
} from "./constants";

export const setLocale = async (locale: TLocale) => {
  if (!LOCALE_LIST.includes(locale)) return;

  const cookieStore = await cookies();
  cookieStore.set(LOCALE_COOKIE_NAME, locale, {
    path: "/",
    maxAge: LOCALE_COOKIE_MAX_AGE_SECONDS,
  });

  const session = await auth();
  if (!session?.user?.id) return;

  await db
    .update(users)
    .set({ locale })
    .where(eq(users.id, session.user.id as UserId));
};

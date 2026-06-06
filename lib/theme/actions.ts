"use server";

import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db/client";
import { users, type UserId } from "@/lib/db/schema";
import {
  THEME_LIST,
  THEME_COOKIE_NAME,
  THEME_COOKIE_MAX_AGE_SECONDS,
  type TTheme,
} from "./constants";

export const setTheme = async (theme: TTheme) => {
  if (!THEME_LIST.includes(theme)) return;

  const cookieStore = await cookies();
  cookieStore.set(THEME_COOKIE_NAME, theme, {
    path: "/",
    maxAge: THEME_COOKIE_MAX_AGE_SECONDS,
  });

  const session = await auth();
  if (!session?.user?.id) return;
  if (session.user.isDemo) return;

  await db
    .update(users)
    .set({ theme })
    .where(eq(users.id, session.user.id as UserId));
};

"use server";

import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { signOut } from "@/lib/auth";
import { db } from "@/lib/db/client";
import { sessions } from "@/lib/db/schema";
import { getSessionCookieConfig } from "@/lib/auth/cookie";
import { createDemoSession } from "@/lib/auth/demo-session";
import { requireMutableUser } from "@/lib/auth/guards";
import { ok, type Result, type TAppError } from "@/lib/errors";
import { ROUTES } from "@/lib/routes";

// Demo sign-in is a state-changing operation, so it must run on POST only.
// A GET route handler would be prefetched by Next in production, silently
// creating sessions without any user action.
export const startDemoSessionAction = async () => {
  const { sessionToken, expires } = await createDemoSession();
  const { name, options } = getSessionCookieConfig();
  (await cookies()).set(name, sessionToken, { ...options, expires });
  redirect(ROUTES.dashboard);
};

export const signOutAction = async () => {
  await signOut({ redirectTo: "/" });
};

export const signOutToGoogleAction = async () => {
  await signOut({ redirectTo: ROUTES.login });
};

// Delete all first, then signOut: Auth.js re-deletes the current token (no-op), but still clears the cookie and redirects.
// Demo users are blocked — the demo account is shared; wiping its sessions would kick all concurrent viewers.
export const signOutAllDevices = async (): Promise<Result<void, TAppError>> => {
  const result = await requireMutableUser();
  if (!result.ok) return result;

  await db.delete(sessions).where(eq(sessions.userId, result.value));
  await signOut({ redirectTo: ROUTES.login });
  return ok(undefined); // unreachable — signOut() throws NEXT_REDIRECT
};

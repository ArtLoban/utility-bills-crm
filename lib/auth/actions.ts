"use server";

import { eq } from "drizzle-orm";
import { signOut } from "@/lib/auth";
import { db } from "@/lib/db/client";
import { sessions } from "@/lib/db/schema";
import { requireMutableUser } from "@/lib/auth/guards";
import { ok, type Result, type DemoModeError } from "@/lib/errors";
import { ROUTES } from "@/lib/routes";

export const signOutAction = async () => {
  await signOut({ redirectTo: "/" });
};

export const signOutToGoogleAction = async () => {
  await signOut({ redirectTo: ROUTES.login });
};

// Delete all first, then signOut: Auth.js re-deletes the current token (no-op), but still clears the cookie and redirects.
// Demo users are blocked — the demo account is shared; wiping its sessions would kick all concurrent viewers.
export const signOutAllDevices = async (): Promise<Result<void, DemoModeError>> => {
  const result = await requireMutableUser();
  if (!result.ok) return result;

  await db.delete(sessions).where(eq(sessions.userId, result.value));
  await signOut({ redirectTo: ROUTES.login });
  return ok(undefined); // unreachable — signOut() throws NEXT_REDIRECT
};

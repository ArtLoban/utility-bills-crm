"use server";

import { eq } from "drizzle-orm";
import { auth, signOut } from "@/lib/auth";
import { db } from "@/lib/db/client";
import { sessions, type UserId } from "@/lib/db/schema";
import { ROUTES } from "@/lib/routes";

export const signOutAction = async () => {
  await signOut({ redirectTo: "/" });
};

// Delete all first, then signOut: Auth.js re-deletes the current token (no-op), but still clears the cookie and redirects.
export const signOutAllDevices = async () => {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthenticated");

  await db.delete(sessions).where(eq(sessions.userId, session.user.id as UserId));
  await signOut({ redirectTo: ROUTES.login });
};

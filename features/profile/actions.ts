"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { requireMutableUser } from "@/lib/auth/guards";
import { db } from "@/lib/db/client";
import { users } from "@/lib/db/schema";
import { appError, err, ok } from "@/lib/errors";
import type { Result, TAppError } from "@/lib/errors";
import { ROUTES } from "@/lib/routes";

import { profileNameSchema } from "./schema";
import type { TProfileNameInput } from "./schema";

export const updateProfileName = async (
  input: TProfileNameInput,
): Promise<Result<void, TAppError>> => {
  const parsed = profileNameSchema.safeParse(input);
  if (!parsed.success) {
    return err(appError.validation(parsed.error.issues[0]?.message ?? "Invalid input"));
  }

  const authGuard = await requireMutableUser();
  if (!authGuard.ok) return authGuard;
  const userId = authGuard.value;

  await db.update(users).set({ name: parsed.data.name }).where(eq(users.id, userId));

  // Revalidate all routes under the app layout so AppNav and Dashboard
  // greeting reflect the new name without requiring a full page reload.
  revalidatePath(ROUTES.home, "layout");
  return ok(undefined);
};

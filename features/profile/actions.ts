"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db/client";
import { users, type UserId } from "@/lib/db/schema";
import { ValidationError, err, ok } from "@/lib/errors";
import type { Result } from "@/lib/errors";

import { profileNameSchema } from "./schema";
import type { TProfileNameInput } from "./schema";

export const updateProfileName = async (
  input: TProfileNameInput,
): Promise<Result<void, ValidationError>> => {
  const parsed = profileNameSchema.safeParse(input);
  if (!parsed.success) {
    return err(new ValidationError(parsed.error.issues[0]?.message ?? "Invalid input"));
  }

  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthenticated");

  await db
    .update(users)
    .set({ name: parsed.data.name })
    .where(eq(users.id, session.user.id as UserId));

  // Revalidate all routes under the app layout so AppNav and Dashboard
  // greeting reflect the new name without requiring a full page reload.
  revalidatePath("/", "layout");
  return ok(undefined);
};

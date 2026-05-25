"use server";

import { revalidatePath } from "next/cache";
import { and, eq, isNull } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db/client";
import { providers } from "@/lib/db/schema/providers";
import type { ProviderId, TProvider } from "@/lib/db/schema/providers";
import type { UserId } from "@/lib/db/schema/auth";
import { providerByIdForUser } from "@/lib/db/access/providers";
import { ValidationError, err, ok } from "@/lib/errors";
import type { NotFoundError, Result } from "@/lib/errors";
import { providerSchema } from "./schema";
import type { TProviderInput } from "./schema";

// Throws on unauthenticated access — unexpected error, not a domain error.
// Auth middleware prevents reaching server actions unauthenticated; if it does
// happen, it is a bug, not a user-facing condition.
const requireAuth = async (): Promise<UserId> => {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthenticated");
  return session.user.id as UserId;
};

export const createProvider = async (
  input: TProviderInput,
): Promise<Result<TProvider, ValidationError>> => {
  const parsed = providerSchema.safeParse(input);
  if (!parsed.success) {
    return err(new ValidationError(parsed.error.issues[0]?.message ?? "Invalid input"));
  }

  const currentUserId = await requireAuth();
  const { name, website, phone, notes } = parsed.data;

  const [newProvider] = await db
    .insert(providers)
    .values({
      ownerId: currentUserId,
      name,
      website: website || null,
      phone: phone || null,
      notes: notes || null,
    })
    .returning();

  revalidatePath("/providers");
  return ok(newProvider!);
};

export const editProvider = async (
  providerId: ProviderId,
  input: TProviderInput,
): Promise<Result<void, ValidationError | NotFoundError>> => {
  const parsed = providerSchema.safeParse(input);
  if (!parsed.success) {
    return err(new ValidationError(parsed.error.issues[0]?.message ?? "Invalid input"));
  }

  const currentUserId = await requireAuth();

  const guard = await providerByIdForUser(currentUserId, providerId);
  if (!guard.ok) return guard;

  const { name, website, phone, notes } = parsed.data;

  await db
    .update(providers)
    .set({ name, website: website || null, phone: phone || null, notes: notes || null })
    .where(and(eq(providers.id, providerId), isNull(providers.deletedAt)));

  revalidatePath("/providers");
  return ok(undefined);
};

export const softDeleteProvider = async (
  providerId: ProviderId,
): Promise<Result<void, NotFoundError>> => {
  const currentUserId = await requireAuth();

  const guard = await providerByIdForUser(currentUserId, providerId);
  if (!guard.ok) return guard;

  // devnote: Active-contracts delete guard omitted — contracts don't exist yet. Add in Stage 4.2.
  await db
    .update(providers)
    .set({ deletedAt: new Date() })
    .where(and(eq(providers.id, providerId), isNull(providers.deletedAt)));

  revalidatePath("/providers");
  return ok(undefined);
};

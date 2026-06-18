"use server";

import { revalidatePath } from "next/cache";
import { and, eq, isNull } from "drizzle-orm";

import { requireMutableUser } from "@/lib/auth/guards";
import { db } from "@/lib/db/client";
import { contracts } from "@/lib/db/schema/contracts";
import { providers } from "@/lib/db/schema/providers";
import type { ProviderId, TProvider } from "@/lib/db/schema/providers";
import { providerByIdForUser } from "@/lib/db/access/providers";
import { appError, err, ok } from "@/lib/errors";
import type { Result, TAppError } from "@/lib/errors";
import { providerSchema } from "./schema";
import type { TProviderInput } from "./schema";

export const createProvider = async (
  input: TProviderInput,
): Promise<Result<TProvider, TAppError>> => {
  const parsed = providerSchema.safeParse(input);
  if (!parsed.success) {
    return err(appError.validation(parsed.error.issues[0]?.message ?? "Invalid input"));
  }

  const authGuard = await requireMutableUser();
  if (!authGuard.ok) return authGuard;
  const userId = authGuard.value;
  const { name, website, phone, notes } = parsed.data;

  const [newProvider] = await db
    .insert(providers)
    .values({
      ownerId: userId,
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
): Promise<Result<void, TAppError>> => {
  const parsed = providerSchema.safeParse(input);
  if (!parsed.success) {
    return err(appError.validation(parsed.error.issues[0]?.message ?? "Invalid input"));
  }

  const authGuard = await requireMutableUser();
  if (!authGuard.ok) return authGuard;
  const userId = authGuard.value;

  const guard = await providerByIdForUser(userId, providerId);
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
): Promise<Result<void, TAppError>> => {
  const authGuard = await requireMutableUser();
  if (!authGuard.ok) return authGuard;
  const userId = authGuard.value;

  const guard = await providerByIdForUser(userId, providerId);
  if (!guard.ok) return guard;

  // Active-contracts guard: a provider referenced by any non-soft-deleted contract
  // cannot be soft-deleted. The DB FK RESTRICT covers hard deletes; this covers soft deletes.
  const activeContracts = await db
    .select({ id: contracts.id })
    .from(contracts)
    .where(and(eq(contracts.providerId, providerId), isNull(contracts.deletedAt)))
    .limit(1);

  if (activeContracts.length > 0) {
    return err(appError.validation("validation.hasActiveContracts"));
  }

  await db
    .update(providers)
    .set({ deletedAt: new Date() })
    .where(and(eq(providers.id, providerId), isNull(providers.deletedAt)));

  revalidatePath("/providers");
  return ok(undefined);
};

"use server";

import { revalidatePath } from "next/cache";
import { and, eq, isNull } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db/client";
import { properties, propertyAccess } from "@/lib/db/schema/properties";
import type { PropertyId, TProperty } from "@/lib/db/schema/properties";
import type { UserId } from "@/lib/db/schema/auth";
import { requirePropertyRole } from "@/lib/db/access/properties";
import { ValidationError, err, ok } from "@/lib/errors";
import type { NotFoundError, Result } from "@/lib/errors";
import { propertySchema } from "./schema";
import type { TPropertyInput } from "./schema";

// Throws on unauthenticated access — unexpected error, not a domain error.
// Auth middleware prevents reaching server actions unauthenticated; if it does
// happen, it is a bug, not a user-facing condition.
const requireAuth = async (): Promise<UserId> => {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthenticated");
  return session.user.id as UserId;
};

export const createProperty = async (
  input: TPropertyInput,
): Promise<Result<TProperty, ValidationError>> => {
  const parsed = propertySchema.safeParse(input);
  if (!parsed.success) {
    return err(new ValidationError(parsed.error.issues[0]?.message ?? "Invalid input"));
  }

  const currentUserId = await requireAuth();
  const { name, type, address, notes } = parsed.data;

  const property = await db.transaction(async (tx) => {
    const [newProperty] = await tx
      .insert(properties)
      .values({ name, type, address: address || null, notes: notes || null })
      .returning();

    await tx.insert(propertyAccess).values({
      propertyId: newProperty!.id,
      userId: currentUserId,
      propertyRole: "owner",
      grantedBy: currentUserId,
    });

    return newProperty!;
  });

  revalidatePath("/properties");
  return ok(property);
};

export const editProperty = async (
  propertyId: PropertyId,
  input: TPropertyInput,
): Promise<Result<void, ValidationError | NotFoundError>> => {
  const parsed = propertySchema.safeParse(input);
  if (!parsed.success) {
    return err(new ValidationError(parsed.error.issues[0]?.message ?? "Invalid input"));
  }

  const currentUserId = await requireAuth();

  const guard = await requirePropertyRole(currentUserId, propertyId, "editor");
  if (!guard.ok) return guard;

  const { name, type, address, notes } = parsed.data;

  await db
    .update(properties)
    .set({ name, type, address: address || null, notes: notes || null })
    .where(and(eq(properties.id, propertyId), isNull(properties.deletedAt)));

  revalidatePath("/properties");
  revalidatePath(`/properties/${propertyId}`);
  return ok(undefined);
};

export const softDeleteProperty = async (
  propertyId: PropertyId,
): Promise<Result<void, NotFoundError>> => {
  const currentUserId = await requireAuth();

  const guard = await requirePropertyRole(currentUserId, propertyId, "owner");
  if (!guard.ok) return guard;

  await db.transaction(async (tx) => {
    const now = new Date();

    // Soft-delete cascade — add each new entity in one line here as introduced.
    await tx
      .update(propertyAccess)
      .set({ deletedAt: now })
      .where(and(eq(propertyAccess.propertyId, propertyId), isNull(propertyAccess.deletedAt)));

    await tx.update(properties).set({ deletedAt: now }).where(eq(properties.id, propertyId));
  });

  revalidatePath("/properties");
  return ok(undefined);
};

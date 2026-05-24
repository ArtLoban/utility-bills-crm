"use server";

import { revalidatePath } from "next/cache";
import { and, eq, isNull } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db/client";
import { services } from "@/lib/db/schema/services";
import type { TService, TServiceId } from "@/lib/db/schema/services";
import type { PropertyId } from "@/lib/db/schema/properties";
import type { TServiceTypeId } from "@/lib/db/schema/service-types";
import type { UserId } from "@/lib/db/schema/auth";
import { requirePropertyRole } from "@/lib/db/access/properties";
import { NotFoundError, ValidationError, err, ok } from "@/lib/errors";
import type { Result } from "@/lib/errors";
import { createServiceSchema, editServiceSchema } from "./schema";
import type { TCreateServiceInput, TEditServiceInput } from "./schema";

// Throws on unauthenticated access — unexpected error, not a domain error.
// Auth middleware prevents reaching server actions unauthenticated; if it does
// happen, it is a bug, not a user-facing condition.
const requireAuth = async (): Promise<UserId> => {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthenticated");
  return session.user.id as UserId;
};

export const createService = async (
  input: TCreateServiceInput,
): Promise<Result<TService, ValidationError | NotFoundError>> => {
  const parsed = createServiceSchema.safeParse(input);
  if (!parsed.success) {
    return err(new ValidationError(parsed.error.issues[0]?.message ?? "Invalid input"));
  }

  const currentUserId = await requireAuth();

  // Brand-casts: Zod validated these as UUID strings; branded types are structurally string.
  const propertyId = parsed.data.propertyId as PropertyId;
  const serviceTypeId = parsed.data.serviceTypeId as TServiceTypeId;
  const notes = parsed.data.notes || null;

  const guard = await requirePropertyRole(currentUserId, propertyId, "editor");
  if (!guard.ok) return guard;

  try {
    const [newService] = await db
      .insert(services)
      .values({ propertyId, serviceTypeId, notes })
      .returning();

    revalidatePath(`/properties/${propertyId}`);
    return ok(newService!);
  } catch (error) {
    // Partial unique index (propertyId, serviceTypeId) WHERE deletedAt IS NULL violated:
    // an active service of this type already exists on this property.
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: unknown }).code === "23505"
    ) {
      return err(new ValidationError("A service of this type is already active for this property"));
    }
    throw error;
  }
};

export const editService = async (
  serviceId: TServiceId,
  input: TEditServiceInput,
): Promise<Result<void, ValidationError | NotFoundError>> => {
  const parsed = editServiceSchema.safeParse(input);
  if (!parsed.success) {
    return err(new ValidationError(parsed.error.issues[0]?.message ?? "Invalid input"));
  }

  const currentUserId = await requireAuth();

  // Fetch the service's propertyId directly — access check happens via requirePropertyRole below.
  const rows = await db
    .select({ propertyId: services.propertyId })
    .from(services)
    .where(and(eq(services.id, serviceId), isNull(services.deletedAt)))
    .limit(1);

  if (rows.length === 0) return err(new NotFoundError("service", serviceId));
  const propertyId = rows[0]!.propertyId;

  // Role check covers missing property, no access, and insufficient role.
  // Decision #108: all three surface as NotFoundError — not ForbiddenError.
  const guard = await requirePropertyRole(currentUserId, propertyId, "editor");
  if (!guard.ok) return guard;

  await db
    .update(services)
    .set({ notes: parsed.data.notes || null })
    .where(and(eq(services.id, serviceId), isNull(services.deletedAt)));

  revalidatePath(`/properties/${propertyId}`);
  revalidatePath(`/properties/${propertyId}/services/${serviceId}`);
  return ok(undefined);
};

export const softDeleteService = async (
  serviceId: TServiceId,
): Promise<Result<void, NotFoundError>> => {
  const currentUserId = await requireAuth();

  const rows = await db
    .select({ propertyId: services.propertyId })
    .from(services)
    .where(and(eq(services.id, serviceId), isNull(services.deletedAt)))
    .limit(1);

  if (rows.length === 0) return err(new NotFoundError("service", serviceId));
  const propertyId = rows[0]!.propertyId;

  const guard = await requirePropertyRole(currentUserId, propertyId, "editor");
  if (!guard.ok) return guard;

  // Soft-delete cascade for service children — add each new entity in one line here as introduced.
  // Future: contracts, tariffs, meters/readings, bills, payments.
  await db
    .update(services)
    .set({ deletedAt: new Date() })
    .where(and(eq(services.id, serviceId), isNull(services.deletedAt)));

  revalidatePath(`/properties/${propertyId}`);
  return ok(undefined);
};

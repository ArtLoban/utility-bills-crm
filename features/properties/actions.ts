"use server";

import { revalidatePath } from "next/cache";
import { and, eq, inArray, isNull } from "drizzle-orm";

import { requireMutableUser } from "@/lib/auth/guards";
import { db } from "@/lib/db/client";
import { accountNumbers } from "@/lib/db/schema/account-numbers";
import { contracts } from "@/lib/db/schema/contracts";
import { meters } from "@/lib/db/schema/meters";
import { paymentDetails } from "@/lib/db/schema/payment-details";
import { readings } from "@/lib/db/schema/readings";
import { bills } from "@/lib/db/schema/bills";
import { payments } from "@/lib/db/schema/payments";
import { properties, propertyAccess } from "@/lib/db/schema/properties";
import { services } from "@/lib/db/schema/services";
import { tariffs } from "@/lib/db/schema/tariffs";
import type { PropertyId, TProperty } from "@/lib/db/schema/properties";
import { requirePropertyRole } from "@/lib/db/access/properties";
import { appError, err, ok } from "@/lib/errors";
import type { Result, TAppError } from "@/lib/errors";
import { propertySchema } from "./schema";
import type { TPropertyInput } from "./schema";

export const createProperty = async (
  input: TPropertyInput,
): Promise<Result<TProperty, TAppError>> => {
  const parsed = propertySchema.safeParse(input);
  if (!parsed.success) {
    return err(appError.validation(parsed.error.issues[0]?.message ?? "Invalid input"));
  }

  const authGuard = await requireMutableUser();
  if (!authGuard.ok) return authGuard;
  const userId = authGuard.value;
  const { name, type, address, notes } = parsed.data;

  const property = await db.transaction(async (tx) => {
    const [newProperty] = await tx
      .insert(properties)
      .values({ name, type, address: address || null, notes: notes || null })
      .returning();

    await tx.insert(propertyAccess).values({
      propertyId: newProperty!.id,
      userId,
      propertyRole: "owner",
      grantedBy: userId,
    });

    return newProperty!;
  });

  revalidatePath("/properties");
  return ok(property);
};

export const editProperty = async (
  propertyId: PropertyId,
  input: TPropertyInput,
): Promise<Result<void, TAppError>> => {
  const parsed = propertySchema.safeParse(input);
  if (!parsed.success) {
    return err(appError.validation(parsed.error.issues[0]?.message ?? "Invalid input"));
  }

  const authGuard = await requireMutableUser();
  if (!authGuard.ok) return authGuard;
  const userId = authGuard.value;

  const guard = await requirePropertyRole(userId, propertyId, "editor");
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
): Promise<Result<void, TAppError>> => {
  const authGuard = await requireMutableUser();
  if (!authGuard.ok) return authGuard;
  const userId = authGuard.value;

  const guard = await requirePropertyRole(userId, propertyId, "owner");
  if (!guard.ok) return guard;

  await db.transaction(async (tx) => {
    const now = new Date();

    // Soft-delete cascade — add each new entity in one line here as introduced.
    await tx
      .update(readings)
      .set({ deletedAt: now })
      .where(
        and(
          inArray(
            readings.meterId,
            db.select({ id: meters.id }).from(meters).where(eq(meters.propertyId, propertyId)),
          ),
          isNull(readings.deletedAt),
        ),
      );
    await tx
      .update(meters)
      .set({ deletedAt: now })
      .where(and(eq(meters.propertyId, propertyId), isNull(meters.deletedAt)));
    // Tariffs, accountNumbers, paymentDetails are grandchildren of services (via contracts).
    const serviceSubquery = db
      .select({ id: services.id })
      .from(services)
      .where(eq(services.propertyId, propertyId));
    const contractSubquery = db
      .select({ id: contracts.id })
      .from(contracts)
      .where(inArray(contracts.serviceId, serviceSubquery));
    await tx
      .update(tariffs)
      .set({ deletedAt: now })
      .where(and(inArray(tariffs.contractId, contractSubquery), isNull(tariffs.deletedAt)));
    await tx
      .update(accountNumbers)
      .set({ deletedAt: now })
      .where(
        and(inArray(accountNumbers.contractId, contractSubquery), isNull(accountNumbers.deletedAt)),
      );
    await tx
      .update(paymentDetails)
      .set({ deletedAt: now })
      .where(
        and(inArray(paymentDetails.contractId, contractSubquery), isNull(paymentDetails.deletedAt)),
      );
    await tx
      .update(contracts)
      .set({ deletedAt: now })
      .where(and(inArray(contracts.serviceId, serviceSubquery), isNull(contracts.deletedAt)));
    // Payments and bills are children of services — must be deleted before services.
    await tx
      .update(payments)
      .set({ deletedAt: now })
      .where(
        and(
          inArray(
            payments.serviceId,
            db
              .select({ id: services.id })
              .from(services)
              .where(eq(services.propertyId, propertyId)),
          ),
          isNull(payments.deletedAt),
        ),
      );
    await tx
      .update(bills)
      .set({ deletedAt: now })
      .where(
        and(
          inArray(
            bills.serviceId,
            db
              .select({ id: services.id })
              .from(services)
              .where(eq(services.propertyId, propertyId)),
          ),
          isNull(bills.deletedAt),
        ),
      );
    await tx
      .update(services)
      .set({ deletedAt: now })
      .where(and(eq(services.propertyId, propertyId), isNull(services.deletedAt)));

    await tx
      .update(propertyAccess)
      .set({ deletedAt: now })
      .where(and(eq(propertyAccess.propertyId, propertyId), isNull(propertyAccess.deletedAt)));

    await tx.update(properties).set({ deletedAt: now }).where(eq(properties.id, propertyId));
  });

  revalidatePath("/properties");
  return ok(undefined);
};

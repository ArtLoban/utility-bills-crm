"use server";

import { revalidatePath } from "next/cache";
import { and, eq, inArray } from "drizzle-orm";
import { notFound } from "next/navigation";

import { db } from "@/lib/db/client";
import { accountNumbers } from "@/lib/db/schema/account-numbers";
import { contracts } from "@/lib/db/schema/contracts";
import { meters } from "@/lib/db/schema/meters";
import { paymentDetails } from "@/lib/db/schema/payment-details";
import { readings } from "@/lib/db/schema/readings";
import { bills } from "@/lib/db/schema/bills";
import { payments } from "@/lib/db/schema/payments";
import { properties, propertyAccess } from "@/lib/db/schema/properties";
import type { PropertyId } from "@/lib/db/schema/properties";
import { services } from "@/lib/db/schema/services";
import { tariffs } from "@/lib/db/schema/tariffs";
import { requireAdmin } from "@/lib/auth/guards";
import { DomainError, shouldHideAsNotFound, err, ok } from "@/lib/errors";
import type { Result } from "@/lib/errors";

const guardAdmin = async (): Promise<void> => {
  const result = await requireAdmin();
  if (!result.ok) {
    if (shouldHideAsNotFound(result.error)) notFound();
    throw result.error;
  }
};

// Restores a soft-deleted property and all children that share its deletedAt timestamp.
// Decision #128: scoped by the soft-delete event timestamp so independently-deleted children
// (earlier deletedAt) are not resurrected.
export const restoreProperty = async (propertyId: string): Promise<Result<void, DomainError>> => {
  await guardAdmin();

  const propertyRows = await db
    .select({ id: properties.id, deletedAt: properties.deletedAt })
    .from(properties)
    .where(eq(properties.id, propertyId as PropertyId))
    .limit(1);

  if (propertyRows.length === 0) notFound();
  const property = propertyRows[0]!;

  if (!property.deletedAt) return err(new DomainError("NOT_DELETED"));

  const stamp = property.deletedAt;

  await db.transaction(async (tx) => {
    const serviceSubquery = db
      .select({ id: services.id })
      .from(services)
      .where(eq(services.propertyId, propertyId as PropertyId));
    const contractSubquery = db
      .select({ id: contracts.id })
      .from(contracts)
      .where(inArray(contracts.serviceId, serviceSubquery));
    const meterSubquery = db
      .select({ id: meters.id })
      .from(meters)
      .where(eq(meters.propertyId, propertyId as PropertyId));

    // Restore deepest children first (mirrors soft-delete cascade order).
    await tx
      .update(readings)
      .set({ deletedAt: null })
      .where(and(inArray(readings.meterId, meterSubquery), eq(readings.deletedAt, stamp)));
    await tx
      .update(tariffs)
      .set({ deletedAt: null })
      .where(and(inArray(tariffs.contractId, contractSubquery), eq(tariffs.deletedAt, stamp)));
    await tx
      .update(accountNumbers)
      .set({ deletedAt: null })
      .where(
        and(
          inArray(accountNumbers.contractId, contractSubquery),
          eq(accountNumbers.deletedAt, stamp),
        ),
      );
    await tx
      .update(paymentDetails)
      .set({ deletedAt: null })
      .where(
        and(
          inArray(paymentDetails.contractId, contractSubquery),
          eq(paymentDetails.deletedAt, stamp),
        ),
      );
    await tx
      .update(contracts)
      .set({ deletedAt: null })
      .where(and(inArray(contracts.serviceId, serviceSubquery), eq(contracts.deletedAt, stamp)));
    await tx
      .update(meters)
      .set({ deletedAt: null })
      .where(and(eq(meters.propertyId, propertyId as PropertyId), eq(meters.deletedAt, stamp)));
    await tx
      .update(payments)
      .set({ deletedAt: null })
      .where(and(inArray(payments.serviceId, serviceSubquery), eq(payments.deletedAt, stamp)));
    await tx
      .update(bills)
      .set({ deletedAt: null })
      .where(and(inArray(bills.serviceId, serviceSubquery), eq(bills.deletedAt, stamp)));
    await tx
      .update(services)
      .set({ deletedAt: null })
      .where(and(eq(services.propertyId, propertyId as PropertyId), eq(services.deletedAt, stamp)));
    await tx
      .update(propertyAccess)
      .set({ deletedAt: null })
      .where(
        and(
          eq(propertyAccess.propertyId, propertyId as PropertyId),
          eq(propertyAccess.deletedAt, stamp),
        ),
      );
    await tx
      .update(properties)
      .set({ deletedAt: null })
      .where(eq(properties.id, propertyId as PropertyId));
  });

  revalidatePath("/art-admin/properties");
  revalidatePath(`/art-admin/properties/${propertyId}`);
  revalidatePath("/properties");
  return ok(undefined);
};

// Physically removes a soft-deleted property. Enforces Decision #42:
// hard delete requires prior soft delete. FK ON DELETE CASCADE clears all descendants.
export const hardDeleteProperty = async (
  propertyId: string,
): Promise<Result<void, DomainError>> => {
  await guardAdmin();

  const propertyRows = await db
    .select({ id: properties.id, deletedAt: properties.deletedAt })
    .from(properties)
    .where(eq(properties.id, propertyId as PropertyId))
    .limit(1);

  if (propertyRows.length === 0) notFound();
  const property = propertyRows[0]!;

  if (!property.deletedAt) return err(new DomainError("NOT_SOFT_DELETED"));

  await db.delete(properties).where(eq(properties.id, propertyId as PropertyId));

  revalidatePath("/art-admin/properties");
  return ok(undefined);
};

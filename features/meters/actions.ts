"use server";

import { revalidatePath } from "next/cache";
import { and, eq, isNull } from "drizzle-orm";

import { requireMutableUser } from "@/lib/auth/guards";
import { db } from "@/lib/db/client";
import { meters } from "@/lib/db/schema/meters";
import type { MeterId, TMeter } from "@/lib/db/schema/meters";
import { readings } from "@/lib/db/schema/readings";
import { PROPERTY_ROLES } from "@/lib/db/schema/properties";
import type { PropertyId } from "@/lib/db/schema/properties";
import type { TServiceTypeId } from "@/lib/db/schema/service-types";
import { serviceTypes } from "@/lib/db/schema/service-types";
import { meterByIdForUser } from "@/lib/db/access/meters";
import { requirePropertyRole } from "@/lib/db/access/properties";
import { appError, err, ok } from "@/lib/errors";
import type { Result, TAppError } from "@/lib/errors";
import { insertMeterInternal } from "./lib";
import { createMeterSchema, replaceMeterSchema, updateMeterSchema } from "./schema";
import type { TCreateMeterInput, TReplaceMeterInput, TUpdateMeterInput } from "./schema";

// PostgreSQL error code 23P01 = exclusion_violation.
const isExclusionViolation = (error: unknown): boolean =>
  typeof error === "object" &&
  error !== null &&
  "code" in error &&
  (error as { code: unknown }).code === "23P01";

// Fetches the serviceType and validates that zoneCount is compatible with supportsZones.
const checkZoneCompatibility = async (
  serviceTypeId: TServiceTypeId,
  zoneCount: 1 | 2 | 3,
): Promise<TAppError | null> => {
  const rows = await db
    .select({ supportsZones: serviceTypes.supportsZones })
    .from(serviceTypes)
    .where(eq(serviceTypes.id, serviceTypeId))
    .limit(1);

  if (rows.length === 0) return appError.validation("validation.zone.serviceTypeNotFound");
  if (!rows[0]!.supportsZones && zoneCount > 1) {
    return appError.validation("validation.zone.unsupported");
  }
  return null;
};

export const createMeter = async (input: TCreateMeterInput): Promise<Result<TMeter, TAppError>> => {
  const parsed = createMeterSchema.safeParse(input);
  if (!parsed.success) {
    return err(appError.validation(parsed.error.issues[0]?.message ?? "Invalid input"));
  }

  const authGuard = await requireMutableUser();
  if (!authGuard.ok) return authGuard;
  const userId = authGuard.value;
  const propertyId = parsed.data.propertyId as PropertyId;
  const serviceTypeId = parsed.data.serviceTypeId as TServiceTypeId;

  const roleGuard = await requirePropertyRole(userId, propertyId, PROPERTY_ROLES.EDITOR);
  if (!roleGuard.ok) return roleGuard;

  const zoneError = await checkZoneCompatibility(serviceTypeId, parsed.data.zoneCount);
  if (zoneError) return err(zoneError);

  const validFrom = new Date(parsed.data.validFrom);
  const installedAt = parsed.data.installedAt ? new Date(parsed.data.installedAt) : null;

  try {
    const meter = await db.transaction(async (tx) =>
      insertMeterInternal(tx, {
        propertyId,
        serviceTypeId,
        serialNumber: parsed.data.serialNumber || null,
        zoneCount: parsed.data.zoneCount,
        installedAt,
        validFrom,
        notes: parsed.data.notes || null,
      }),
    );

    revalidatePath(`/properties/${propertyId}/meters`);
    revalidatePath("/meters");
    return ok(meter);
  } catch (error) {
    if (isExclusionViolation(error)) {
      return err(appError.validation("validation.create.overlap"));
    }
    throw error;
  }
};

export const updateMeter = async (
  meterId: MeterId,
  input: TUpdateMeterInput,
): Promise<Result<void, TAppError>> => {
  const parsed = updateMeterSchema.safeParse(input);
  if (!parsed.success) {
    return err(appError.validation(parsed.error.issues[0]?.message ?? "Invalid input"));
  }

  const authGuard = await requireMutableUser();
  if (!authGuard.ok) return authGuard;
  const userId = authGuard.value;

  const meterAccess = await meterByIdForUser(userId, meterId);
  if (!meterAccess.ok) return meterAccess;

  const roleGuard = await requirePropertyRole(
    userId,
    meterAccess.value.propertyId,
    PROPERTY_ROLES.EDITOR,
  );
  if (!roleGuard.ok) return roleGuard;

  const installedAt = parsed.data.installedAt ? new Date(parsed.data.installedAt) : null;
  const removedAt = parsed.data.removedAt ? new Date(parsed.data.removedAt) : null;

  await db
    .update(meters)
    .set({
      serialNumber: parsed.data.serialNumber || null,
      installedAt,
      removedAt,
      notes: parsed.data.notes || null,
    })
    .where(and(eq(meters.id, meterId), isNull(meters.deletedAt)));

  revalidatePath(`/properties/${meterAccess.value.propertyId}/meters`);
  revalidatePath(`/properties/${meterAccess.value.propertyId}/meters/${meterId}`);
  revalidatePath("/meters");
  return ok(undefined);
};

export const replaceMeter = async (
  input: TReplaceMeterInput,
): Promise<Result<TMeter, TAppError>> => {
  const parsed = replaceMeterSchema.safeParse(input);
  if (!parsed.success) {
    return err(appError.validation(parsed.error.issues[0]?.message ?? "Invalid input"));
  }

  const authGuard = await requireMutableUser();
  if (!authGuard.ok) return authGuard;
  const userId = authGuard.value;
  const currentMeterId = parsed.data.currentMeterId as MeterId;

  const meterAccess = await meterByIdForUser(userId, currentMeterId);
  if (!meterAccess.ok) return meterAccess;

  const currentMeter = meterAccess.value;

  if (currentMeter.validTo !== null) {
    return err(appError.validation("validation.replace.alreadyClosed"));
  }

  const roleGuard = await requirePropertyRole(
    userId,
    currentMeter.propertyId,
    PROPERTY_ROLES.EDITOR,
  );
  if (!roleGuard.ok) return roleGuard;

  const replacementDate = new Date(parsed.data.replacementDate);

  if (replacementDate <= currentMeter.validFrom) {
    return err(appError.validation("validation.replace.dateBeforeStart"));
  }

  const zoneError = await checkZoneCompatibility(currentMeter.serviceTypeId, parsed.data.zoneCount);
  if (zoneError) return err(zoneError);

  const installedAt = parsed.data.installedAt ? new Date(parsed.data.installedAt) : null;

  try {
    const newMeter = await db.transaction(async (tx) => {
      // Close the current meter at replacementDate.
      await tx
        .update(meters)
        .set({ validTo: replacementDate })
        .where(and(eq(meters.id, currentMeterId), isNull(meters.deletedAt)));

      // Open the new meter starting at the same instant — half-open intervals meet without gap.
      return insertMeterInternal(tx, {
        propertyId: currentMeter.propertyId,
        serviceTypeId: currentMeter.serviceTypeId,
        serialNumber: parsed.data.serialNumber || null,
        zoneCount: parsed.data.zoneCount,
        installedAt,
        validFrom: replacementDate,
        notes: parsed.data.notes || null,
      });
    });

    revalidatePath(`/properties/${currentMeter.propertyId}/meters`);
    revalidatePath(`/properties/${currentMeter.propertyId}/meters/${currentMeterId}`);
    revalidatePath("/meters");
    return ok(newMeter);
  } catch (error) {
    if (isExclusionViolation(error)) {
      return err(appError.validation("validation.replace.overlap"));
    }
    throw error;
  }
};

export const softDeleteMeter = async (meterId: MeterId): Promise<Result<void, TAppError>> => {
  const authGuard = await requireMutableUser();
  if (!authGuard.ok) return authGuard;
  const userId = authGuard.value;

  const meterAccess = await meterByIdForUser(userId, meterId);
  if (!meterAccess.ok) return meterAccess;

  const roleGuard = await requirePropertyRole(
    userId,
    meterAccess.value.propertyId,
    PROPERTY_ROLES.EDITOR,
  );
  if (!roleGuard.ok) return roleGuard;

  const now = new Date();

  await db.transaction(async (tx) => {
    await tx
      .update(readings)
      .set({ deletedAt: now })
      .where(and(eq(readings.meterId, meterId), isNull(readings.deletedAt)));

    await tx
      .update(meters)
      .set({ deletedAt: now })
      .where(and(eq(meters.id, meterId), isNull(meters.deletedAt)));
  });

  revalidatePath(`/properties/${meterAccess.value.propertyId}/meters`);
  revalidatePath("/meters");
  return ok(undefined);
};

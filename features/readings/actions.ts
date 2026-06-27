"use server";

import { revalidatePath } from "next/cache";
import { and, eq, isNull } from "drizzle-orm";

import { requireMutableUser } from "@/lib/auth/guards";
import { db } from "@/lib/db/client";
import { readings } from "@/lib/db/schema/readings";
import type { ReadingId, TReading } from "@/lib/db/schema/readings";
import type { MeterId, TMeter } from "@/lib/db/schema/meters";
import { meterByIdForUser } from "@/lib/db/access/meters";
import { readingByIdForUser } from "@/lib/db/access/readings";
import { requirePropertyRole } from "@/lib/db/access/properties";
import { PROPERTY_ROLES } from "@/lib/db/schema/properties";
import { appError, err, ok } from "@/lib/errors";
import type { Result, TAppError } from "@/lib/errors";
import { ROUTES } from "@/lib/routes";
import { createReadingSchema, updateReadingSchema } from "./schema";
import type { TCreateReadingInput, TUpdateReadingInput } from "./schema";

// Validates that readAt falls within the meter's system temporal window [validFrom, validTo ?? ∞).
// Returns a validation error carrying a relative i18n key (namespace "readings") — the client
// translates it on the ERROR_CODES.VALIDATION branch.
const validateReadingWindow = (readAt: Date, meter: TMeter): TAppError | null => {
  if (readAt < meter.validFrom) {
    return appError.validation("validation.window.before");
  }
  if (meter.validTo !== null && readAt >= meter.validTo) {
    return appError.validation("validation.window.after");
  }
  return null;
};

// Validates that zone values are consistent with the meter's zoneCount.
// zoneCount=1 → valueT2/T3 absent. zoneCount=2 → valueT2 present, valueT3 absent. Etc.
// Messages are relative i18n keys (namespace "readings").
const validateZoneValues = (
  zoneCount: number,
  valueT2: number | undefined,
  valueT3: number | undefined,
): TAppError | null => {
  if (zoneCount === 1) {
    if (valueT2 !== undefined) {
      return appError.validation("validation.zone.t2ForSingle");
    }
    if (valueT3 !== undefined) {
      return appError.validation("validation.zone.t3ForSingle");
    }
  } else if (zoneCount === 2) {
    if (valueT2 === undefined) {
      return appError.validation("validation.zone.t2Required");
    }
    if (valueT3 !== undefined) {
      return appError.validation("validation.zone.t3ForTwo");
    }
  } else if (zoneCount === 3) {
    if (valueT2 === undefined) {
      return appError.validation("validation.zone.t2Required");
    }
    if (valueT3 === undefined) {
      return appError.validation("validation.zone.t3Required");
    }
  }
  return null;
};

export const createReading = async (
  input: TCreateReadingInput,
): Promise<Result<TReading, TAppError>> => {
  const parsed = createReadingSchema.safeParse(input);
  if (!parsed.success) {
    return err(appError.validation(parsed.error.issues[0]?.message ?? "Invalid input"));
  }

  const authGuard = await requireMutableUser();
  if (!authGuard.ok) return authGuard;
  const userId = authGuard.value;
  const meterId = parsed.data.meterId as MeterId;

  const meterAccess = await meterByIdForUser(userId, meterId);
  if (!meterAccess.ok) return meterAccess;
  const meter = meterAccess.value;

  const roleGuard = await requirePropertyRole(userId, meter.propertyId, PROPERTY_ROLES.EDITOR);
  if (!roleGuard.ok) return roleGuard;

  const readAt = new Date(parsed.data.readAt);

  const windowError = validateReadingWindow(readAt, meter);
  if (windowError) return err(windowError);

  const zoneError = validateZoneValues(meter.zoneCount, parsed.data.valueT2, parsed.data.valueT3);
  if (zoneError) return err(zoneError);

  const row = await db
    .insert(readings)
    .values({
      meterId,
      readAt,
      valueT1: String(parsed.data.valueT1),
      valueT2: parsed.data.valueT2 !== undefined ? String(parsed.data.valueT2) : null,
      valueT3: parsed.data.valueT3 !== undefined ? String(parsed.data.valueT3) : null,
      notes: parsed.data.notes || null,
      createdBy: userId,
    })
    .returning();

  revalidatePath(`/properties/${meter.propertyId}/meters/${meterId}`);
  revalidatePath(ROUTES.meters);

  return ok(row[0]!);
};

export const updateReading = async (
  readingId: ReadingId,
  input: TUpdateReadingInput,
): Promise<Result<void, TAppError>> => {
  const parsed = updateReadingSchema.safeParse(input);
  if (!parsed.success) {
    return err(appError.validation(parsed.error.issues[0]?.message ?? "Invalid input"));
  }

  const authGuard = await requireMutableUser();
  if (!authGuard.ok) return authGuard;
  const userId = authGuard.value;

  const readingAccess = await readingByIdForUser(userId, readingId);
  if (!readingAccess.ok) return readingAccess;
  const reading = readingAccess.value;

  const meterAccess = await meterByIdForUser(userId, reading.meterId);
  if (!meterAccess.ok) return meterAccess;
  const meter = meterAccess.value;

  const roleGuard = await requirePropertyRole(userId, meter.propertyId, PROPERTY_ROLES.EDITOR);
  if (!roleGuard.ok) return roleGuard;

  const readAt = new Date(parsed.data.readAt);

  const windowError = validateReadingWindow(readAt, meter);
  if (windowError) return err(windowError);

  const zoneError = validateZoneValues(meter.zoneCount, parsed.data.valueT2, parsed.data.valueT3);
  if (zoneError) return err(zoneError);

  await db
    .update(readings)
    .set({
      readAt,
      valueT1: String(parsed.data.valueT1),
      valueT2: parsed.data.valueT2 !== undefined ? String(parsed.data.valueT2) : null,
      valueT3: parsed.data.valueT3 !== undefined ? String(parsed.data.valueT3) : null,
      notes: parsed.data.notes || null,
    })
    .where(and(eq(readings.id, readingId), isNull(readings.deletedAt)));

  revalidatePath(`/properties/${meter.propertyId}/meters/${reading.meterId}`);
  revalidatePath(ROUTES.meters);

  return ok(undefined);
};

export const softDeleteReading = async (readingId: ReadingId): Promise<Result<void, TAppError>> => {
  const authGuard = await requireMutableUser();
  if (!authGuard.ok) return authGuard;
  const userId = authGuard.value;

  const readingAccess = await readingByIdForUser(userId, readingId);
  if (!readingAccess.ok) return readingAccess;
  const reading = readingAccess.value;

  const meterAccess = await meterByIdForUser(userId, reading.meterId);
  if (!meterAccess.ok) return meterAccess;
  const meter = meterAccess.value;

  const roleGuard = await requirePropertyRole(userId, meter.propertyId, PROPERTY_ROLES.EDITOR);
  if (!roleGuard.ok) return roleGuard;

  await db
    .update(readings)
    .set({ deletedAt: new Date() })
    .where(and(eq(readings.id, readingId), isNull(readings.deletedAt)));

  revalidatePath(`/properties/${meter.propertyId}/meters/${reading.meterId}`);
  revalidatePath(ROUTES.meters);

  return ok(undefined);
};

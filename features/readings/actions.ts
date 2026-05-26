"use server";

import { revalidatePath } from "next/cache";
import { and, eq, isNull } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db/client";
import { readings } from "@/lib/db/schema/readings";
import type { ReadingId, TReading } from "@/lib/db/schema/readings";
import type { MeterId, TMeter } from "@/lib/db/schema/meters";
import type { UserId } from "@/lib/db/schema/auth";
import { meterByIdForUser } from "@/lib/db/access/meters";
import { readingByIdForUser } from "@/lib/db/access/readings";
import { requirePropertyRole } from "@/lib/db/access/properties";
import { NotFoundError, ValidationError, err, ok } from "@/lib/errors";
import type { Result } from "@/lib/errors";
import { createReadingSchema, updateReadingSchema } from "./schema";
import type { TCreateReadingInput, TUpdateReadingInput } from "./schema";

// Throws on unauthenticated access — unexpected error, not a domain error.
const requireAuth = async (): Promise<UserId> => {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthenticated");
  return session.user.id as UserId;
};

// Validates that readAt falls within the meter's system temporal window [validFrom, validTo ?? ∞).
const validateReadingWindow = (readAt: Date, meter: TMeter): ValidationError | null => {
  if (readAt < meter.validFrom) {
    return new ValidationError(
      "Reading date is before the meter's active period — check the meter's active-since date",
    );
  }
  if (meter.validTo !== null && readAt >= meter.validTo) {
    return new ValidationError("Reading date is after the meter was deactivated");
  }
  return null;
};

// Validates that zone values are consistent with the meter's zoneCount.
// zoneCount=1 → valueT2/T3 absent. zoneCount=2 → valueT2 present, valueT3 absent. Etc.
const validateZoneValues = (
  zoneCount: number,
  valueT2: number | undefined,
  valueT3: number | undefined,
): ValidationError | null => {
  if (zoneCount === 1) {
    if (valueT2 !== undefined) {
      return new ValidationError("Zone 2 value provided for a single-zone meter");
    }
    if (valueT3 !== undefined) {
      return new ValidationError("Zone 3 value provided for a single-zone meter");
    }
  } else if (zoneCount === 2) {
    if (valueT2 === undefined) {
      return new ValidationError("Zone 2 value is required for a two-zone meter");
    }
    if (valueT3 !== undefined) {
      return new ValidationError("Zone 3 value provided for a two-zone meter");
    }
  } else if (zoneCount === 3) {
    if (valueT2 === undefined) {
      return new ValidationError("Zone 2 value is required for a three-zone meter");
    }
    if (valueT3 === undefined) {
      return new ValidationError("Zone 3 value is required for a three-zone meter");
    }
  }
  return null;
};

export const createReading = async (
  input: TCreateReadingInput,
): Promise<Result<TReading, ValidationError | NotFoundError>> => {
  const parsed = createReadingSchema.safeParse(input);
  if (!parsed.success) {
    return err(new ValidationError(parsed.error.issues[0]?.message ?? "Invalid input"));
  }

  const userId = await requireAuth();
  const meterId = parsed.data.meterId as MeterId;

  const meterAccess = await meterByIdForUser(userId, meterId);
  if (!meterAccess.ok) return meterAccess;
  const meter = meterAccess.value;

  const roleGuard = await requirePropertyRole(userId, meter.propertyId, "editor");
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
  revalidatePath("/meters");

  return ok(row[0]!);
};

export const updateReading = async (
  readingId: ReadingId,
  input: TUpdateReadingInput,
): Promise<Result<void, ValidationError | NotFoundError>> => {
  const parsed = updateReadingSchema.safeParse(input);
  if (!parsed.success) {
    return err(new ValidationError(parsed.error.issues[0]?.message ?? "Invalid input"));
  }

  const userId = await requireAuth();

  const readingAccess = await readingByIdForUser(userId, readingId);
  if (!readingAccess.ok) return readingAccess;
  const reading = readingAccess.value;

  const meterAccess = await meterByIdForUser(userId, reading.meterId);
  if (!meterAccess.ok) return meterAccess;
  const meter = meterAccess.value;

  const roleGuard = await requirePropertyRole(userId, meter.propertyId, "editor");
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
  revalidatePath("/meters");

  return ok(undefined);
};

export const softDeleteReading = async (
  readingId: ReadingId,
): Promise<Result<void, NotFoundError>> => {
  const userId = await requireAuth();

  const readingAccess = await readingByIdForUser(userId, readingId);
  if (!readingAccess.ok) return readingAccess;
  const reading = readingAccess.value;

  const meterAccess = await meterByIdForUser(userId, reading.meterId);
  if (!meterAccess.ok) return meterAccess;
  const meter = meterAccess.value;

  const roleGuard = await requirePropertyRole(userId, meter.propertyId, "editor");
  if (!roleGuard.ok) return roleGuard;

  await db
    .update(readings)
    .set({ deletedAt: new Date() })
    .where(and(eq(readings.id, readingId), isNull(readings.deletedAt)));

  revalidatePath(`/properties/${meter.propertyId}/meters/${reading.meterId}`);
  revalidatePath("/meters");

  return ok(undefined);
};

import { and, desc, eq, inArray, isNull, max, sql } from "drizzle-orm";

import { db } from "@/lib/db/client";
import { readings } from "@/lib/db/schema/readings";
import type { ReadingId, TReading } from "@/lib/db/schema/readings";
import { meters } from "@/lib/db/schema/meters";
import type { MeterId } from "@/lib/db/schema/meters";
import type { PropertyId } from "@/lib/db/schema/properties";
import type { TServiceTypeId } from "@/lib/db/schema/service-types";
import type { UserId } from "@/lib/db/schema/auth";
import { meterByIdForUser } from "./meters";
import { appError, err, ok } from "@/lib/errors";
import type { Result, TAppError } from "@/lib/errors";

// --- Access helpers ---
// Pure functions: userId is always a parameter. Never read the auth session internally.

export const readingsByMeterId = async (
  userId: UserId,
  meterId: MeterId,
): Promise<Result<TReading[], TAppError>> => {
  const access = await meterByIdForUser(userId, meterId);
  if (!access.ok) return access;

  const rows = await db
    .select()
    .from(readings)
    .where(and(eq(readings.meterId, meterId), isNull(readings.deletedAt)))
    .orderBy(desc(readings.readAt));

  return ok(rows);
};

export const mostRecentReadingForMeter = async (
  userId: UserId,
  meterId: MeterId,
): Promise<Result<TReading | null, TAppError>> => {
  const access = await meterByIdForUser(userId, meterId);
  if (!access.ok) return access;

  const rows = await db
    .select()
    .from(readings)
    .where(and(eq(readings.meterId, meterId), isNull(readings.deletedAt)))
    .orderBy(desc(readings.readAt))
    .limit(1);

  return ok(rows[0] ?? null);
};

export const readingByIdForUser = async (
  userId: UserId,
  readingId: ReadingId,
): Promise<Result<TReading, TAppError>> => {
  const rows = await db
    .select()
    .from(readings)
    .where(and(eq(readings.id, readingId), isNull(readings.deletedAt)))
    .limit(1);

  if (rows.length === 0) return err(appError.notFound("reading", readingId));

  const reading = rows[0]!;

  // Decision #108: inaccessible reading is indistinguishable from a nonexistent one.
  const access = await meterByIdForUser(userId, reading.meterId);
  if (!access.ok) return err(appError.notFound("reading", readingId));

  return ok(reading);
};

// No access check — only called after already-access-controlled metersForGlobalList.
// Returns a Map so callers can do O(1) lookups per meter.
// Uses a subquery to get the max readAt per meter, then joins to fetch the full row.
// If two readings share the same max readAt, only one is returned (deterministic per DB ordering).
export const lastReadingsByMeterIds = async (
  meterIds: MeterId[],
): Promise<Map<MeterId, TReading>> => {
  if (meterIds.length === 0) return new Map();

  const latestPerMeter = db
    .select({
      meterId: readings.meterId,
      maxReadAt: max(readings.readAt).as("max_read_at"),
    })
    .from(readings)
    .where(and(inArray(readings.meterId, meterIds), isNull(readings.deletedAt)))
    .groupBy(readings.meterId)
    .as("latest_per_meter");

  const rows = await db
    .select({ reading: readings })
    .from(readings)
    .innerJoin(
      latestPerMeter,
      and(
        eq(readings.meterId, latestPerMeter.meterId),
        eq(readings.readAt, sql`${latestPerMeter.maxReadAt}`),
      ),
    )
    .where(isNull(readings.deletedAt));

  const map = new Map<MeterId, TReading>();
  for (const { reading } of rows) {
    // If multiple readings share the same max readAt, last one in iteration wins — acceptable.
    if (!map.has(reading.meterId)) {
      map.set(reading.meterId, reading);
    }
  }
  return map;
};

// Latest reading date per service type for one property, in a single grouped query.
// A meter belongs to (propertyId, serviceTypeId) — not to a service directly — so the
// "last reading" of a service is the most recent reading across that property's meters of
// the same service type. No access check: the caller has already verified property access.
export const lastReadingDatesByServiceType = async (
  propertyId: PropertyId,
): Promise<Map<TServiceTypeId, Date>> => {
  const rows = await db
    .select({
      serviceTypeId: meters.serviceTypeId,
      lastReadAt: max(readings.readAt),
    })
    .from(readings)
    .innerJoin(meters, eq(readings.meterId, meters.id))
    .where(
      and(eq(meters.propertyId, propertyId), isNull(meters.deletedAt), isNull(readings.deletedAt)),
    )
    .groupBy(meters.serviceTypeId);

  const map = new Map<TServiceTypeId, Date>();
  for (const { serviceTypeId, lastReadAt } of rows) {
    if (lastReadAt) map.set(serviceTypeId, lastReadAt);
  }

  return map;
};

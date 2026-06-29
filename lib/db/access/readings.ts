import { and, asc, count, desc, eq, gte, inArray, isNull, lt, lte, max, sql } from "drizzle-orm";

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
import type { TReadingsListParams } from "@/features/readings/types";
import { TServerPagination } from "@/lib/types/data-table";

// --- List query ---

export type TReadingsListResult = {
  data: TReading[];
  pagination: TServerPagination;
};

// Builds the WHERE conditions for the readings list query.
// `readAt` is timestamptz while the date filter arrives as YYYY-MM-DD, so the range is
// compared on the calendar day (`::date`) — inclusive on both ends. (The bills list
// compares a `date` column directly and needs no cast; here the cast is required.)
const buildReadingsConditions = (meterId: MeterId, params: TReadingsListParams) => {
  const conds = [eq(readings.meterId, meterId), isNull(readings.deletedAt)];

  if (params.dateFrom) conds.push(gte(sql`${readings.readAt}::date`, params.dateFrom));
  if (params.dateTo) conds.push(lte(sql`${readings.readAt}::date`, params.dateTo));

  return and(...conds);
};

// Builds the ORDER BY clause. `readAt` is the only sortable column; default DESC.
const buildReadingsOrderBy = (params: TReadingsListParams) => {
  const dir = params.sortOrder === "asc" ? asc : desc;
  return [dir(readings.readAt)];
};

export const getReadingsList = async (
  userId: UserId,
  meterId: MeterId,
  params: TReadingsListParams,
): Promise<Result<TReadingsListResult, TAppError>> => {
  const access = await meterByIdForUser(userId, meterId);
  if (!access.ok) return access;

  const where = buildReadingsConditions(meterId, params);
  const orderBy = buildReadingsOrderBy(params);
  const offset = (params.page - 1) * params.pageSize;

  // Two queries run in parallel: total count and the paginated page.
  const [countResult, rows] = await Promise.all([
    db.select({ total: count() }).from(readings).where(where),
    db
      .select()
      .from(readings)
      .where(where)
      .orderBy(...orderBy)
      .limit(params.pageSize)
      .offset(offset),
  ]);

  const total = countResult[0]?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / params.pageSize));

  return ok({
    data: rows,
    pagination: { page: params.page, pageSize: params.pageSize, total, totalPages },
  });
};

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

// The reading immediately preceding `before` — used to compute the warning/delta context
// when editing an existing reading.
export const previousReadingForMeter = async (
  userId: UserId,
  meterId: MeterId,
  before: Date,
): Promise<Result<TReading | null, TAppError>> => {
  const access = await meterByIdForUser(userId, meterId);
  if (!access.ok) return access;

  const rows = await db
    .select()
    .from(readings)
    .where(
      and(eq(readings.meterId, meterId), isNull(readings.deletedAt), lt(readings.readAt, before)),
    )
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

// No access check — only called after an already-access-controlled meters query (getMetersList).
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

import { and, asc, count, countDistinct, desc, eq, inArray, isNotNull, isNull } from "drizzle-orm";

import { db } from "@/lib/db/client";
import { meters } from "@/lib/db/schema/meters";
import type { MeterId, TMeter } from "@/lib/db/schema/meters";
import { properties, propertyAccess } from "@/lib/db/schema/properties";
import type { PropertyId, TPropertyRole, TPropertyType } from "@/lib/db/schema/properties";
import { serviceTypes } from "@/lib/db/schema/service-types";
import type { TServiceTypeId, TServiceType } from "@/lib/db/schema/service-types";
import type { TServiceTypeCode } from "@/features/services/service-type";
import type { TReading } from "@/lib/db/schema/readings";
import type { UserId } from "@/lib/db/schema/auth";
import { propertyByIdForUser } from "./properties";
import { lastReadingsByMeterIds } from "./readings";
import { appError, err, ok } from "@/lib/errors";
import type { Result, TAppError } from "@/lib/errors";
import type { TMetersListParams } from "@/features/meters/types";
import { METER_STATUSES } from "@/features/meters/types";
import type { TServerPagination } from "@/lib/types/data-table";

// --- Result types ---

// serviceType.code is narrowed from the DB's string to the seeded union at the single map point below.
type TMeterServiceType = Omit<TServiceType, "code"> & { code: TServiceTypeCode };

export type TMeterGlobalRow = {
  meter: TMeter;
  serviceType: TMeterServiceType;
  property: { id: PropertyId; name: string; type: TPropertyType };
  role: TPropertyRole;
  lastReading: TReading | null;
};

export type TMetersListResult = {
  data: TMeterGlobalRow[];
  pagination: TServerPagination;
  totals: { propertyCount: number; activeCount: number };
};

// --- Access helpers ---
// Pure functions: userId is always a parameter. Never read the auth session internally.

export const metersByPropertyId = async (
  userId: UserId,
  propertyId: PropertyId,
): Promise<Result<TMeter[], TAppError>> => {
  const access = await propertyByIdForUser(userId, propertyId);
  if (!access.ok) return access;

  const rows = await db
    .select()
    .from(meters)
    .where(and(eq(meters.propertyId, propertyId), isNull(meters.deletedAt)))
    .orderBy(asc(meters.serviceTypeId), desc(meters.validFrom));

  return ok(rows);
};

export const currentMeterForServiceType = async (
  userId: UserId,
  propertyId: PropertyId,
  serviceTypeId: TServiceTypeId,
): Promise<Result<TMeter | null, TAppError>> => {
  const access = await propertyByIdForUser(userId, propertyId);
  if (!access.ok) return access;

  const rows = await db
    .select()
    .from(meters)
    .where(
      and(
        eq(meters.propertyId, propertyId),
        eq(meters.serviceTypeId, serviceTypeId),
        isNull(meters.validTo),
        isNull(meters.deletedAt),
      ),
    )
    .limit(1);

  return ok(rows[0] ?? null);
};

export const meterByIdForUser = async (
  userId: UserId,
  meterId: MeterId,
): Promise<Result<TMeter, TAppError>> => {
  const rows = await db
    .select()
    .from(meters)
    .where(and(eq(meters.id, meterId), isNull(meters.deletedAt)))
    .limit(1);

  if (rows.length === 0) return err(appError.notFound("meter", meterId));

  const meter = rows[0]!;

  // Decision #108: inaccessible meter is indistinguishable from a nonexistent one.
  const access = await propertyByIdForUser(userId, meter.propertyId);
  if (!access.ok) return err(appError.notFound("meter", meterId));

  return ok(meter);
};

// Builds the WHERE conditions array for the meters list query.
const buildConditions = (userId: UserId, params: TMetersListParams) => {
  const conds = [
    isNull(meters.deletedAt),
    isNull(properties.deletedAt),
    eq(propertyAccess.userId, userId),
    isNull(propertyAccess.deletedAt),
  ];

  if (params.propertyId) conds.push(eq(properties.id, params.propertyId as PropertyId));
  if (params.services?.length) conds.push(inArray(serviceTypes.code, params.services));
  // Status maps to the system temporal range: validTo IS NULL = active.
  if (params.status === METER_STATUSES.ACTIVE) conds.push(isNull(meters.validTo));
  else if (params.status === METER_STATUSES.HISTORICAL) conds.push(isNotNull(meters.validTo));

  return and(...conds);
};

// Builds the ORDER BY clause. Default: property name ASC.
const buildOrderBy = (params: TMetersListParams) => {
  const dir = params.sortOrder === "asc" ? asc : desc;
  switch (params.sortBy) {
    case "service":
      return [dir(serviceTypes.sortOrder), asc(properties.name)] as const;
    case "installed":
      return [dir(meters.installedAt), asc(properties.name)] as const;
    case "property":
    default:
      return [dir(properties.name), asc(serviceTypes.sortOrder), desc(meters.validFrom)] as const;
  }
};

export const getMetersList = async (
  userId: UserId,
  params: TMetersListParams,
): Promise<TMetersListResult> => {
  const where = buildConditions(userId, params);
  const orderBy = buildOrderBy(params);
  const offset = (params.page - 1) * params.pageSize;

  // Two queries run in parallel: aggregates over the whole filtered set, and the paginated page.
  const [aggregateResult, rows] = await Promise.all([
    db
      .select({
        total: count(),
        propertyCount: countDistinct(properties.id),
        historicalCount: count(meters.validTo),
      })
      .from(meters)
      .innerJoin(properties, eq(meters.propertyId, properties.id))
      .innerJoin(
        propertyAccess,
        and(
          eq(propertyAccess.propertyId, properties.id),
          eq(propertyAccess.userId, userId),
          isNull(propertyAccess.deletedAt),
        ),
      )
      .innerJoin(serviceTypes, eq(meters.serviceTypeId, serviceTypes.id))
      .where(where),

    db
      .select({
        meter: meters,
        serviceType: serviceTypes,
        propertyId: properties.id,
        propertyName: properties.name,
        propertyType: properties.type,
        role: propertyAccess.propertyRole,
      })
      .from(meters)
      .innerJoin(properties, eq(meters.propertyId, properties.id))
      .innerJoin(
        propertyAccess,
        and(
          eq(propertyAccess.propertyId, properties.id),
          eq(propertyAccess.userId, userId),
          isNull(propertyAccess.deletedAt),
        ),
      )
      .innerJoin(serviceTypes, eq(meters.serviceTypeId, serviceTypes.id))
      .where(where)
      .orderBy(...orderBy)
      .limit(params.pageSize)
      .offset(offset),
  ]);

  const aggregate = aggregateResult[0];
  const total = aggregate?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / params.pageSize));

  // Last readings are fetched only for the current page's rows.
  const lastReadings = await lastReadingsByMeterIds(rows.map((r) => r.meter.id));

  return {
    data: rows.map((r) => ({
      meter: r.meter,
      serviceType: { ...r.serviceType, code: r.serviceType.code as TServiceTypeCode },
      property: { id: r.propertyId, name: r.propertyName, type: r.propertyType },
      role: r.role,
      lastReading: lastReadings.get(r.meter.id) ?? null,
    })),
    pagination: { page: params.page, pageSize: params.pageSize, total, totalPages },
    totals: {
      propertyCount: aggregate?.propertyCount ?? 0,
      activeCount: total - (aggregate?.historicalCount ?? 0),
    },
  };
};

import { and, asc, eq, exists, isNull, lte, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

import { db } from "@/lib/db/client";
import { toIsoDate } from "@/lib/format/date";
import type { UserId } from "@/lib/db/schema/auth";
import { meters } from "@/lib/db/schema/meters";
import type { MeterId } from "@/lib/db/schema/meters";
import { meterServices } from "@/lib/db/schema/meter-services";
import { readings } from "@/lib/db/schema/readings";
import { services } from "@/lib/db/schema/services";
import { serviceTypes } from "@/lib/db/schema/service-types";
import { properties, propertyAccess } from "@/lib/db/schema/properties";
import type { PropertyId } from "@/lib/db/schema/properties";

// --- Types ---

export type TAvailableConsumptionService = {
  code: string;
  unit: string; // "kwh" | "m3" | "gcal" — non-null guaranteed by measurementType='metered' DB check
};

export type TMonthlyConsumptionAggregate = {
  months: string[]; // "YYYY-MM-DD" first-of-month, ordered asc
  serviceTypeCode: string;
  unit: string;
  zones: {
    key: "t1" | "t2" | "t3";
    monthlyConsumption: number[]; // index-aligned to months; 0 for gap months
  }[];
};

// --- Helpers ---

// Copied from features/ledger/query.ts — same logic, different domain (meter consumption vs billing).
// Not extracted to lib/ to avoid coupling two unrelated domains over a 10-line utility.
const generateMonthAxis = (from: string, to: string): string[] => {
  const months: string[] = [];
  const start = new Date(from.slice(0, 7) + "-01T00:00:00Z");
  const end = new Date(to.slice(0, 7) + "-01T00:00:00Z");
  const cur = new Date(start);
  while (cur <= end) {
    months.push(toIsoDate(cur));
    cur.setUTCMonth(cur.getUTCMonth() + 1);
  }
  return months;
};

const toMonthKey = (date: Date): string =>
  toIsoDate(new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1)));

// --- Queries ---

// Returns metered service types that have at least one accessible meter,
// ordered by serviceType.sortOrder for a stable picker display.
// Does NOT require readings — the picker shows services the user could track,
// whether or not data exists for the current date range.
// propertyId is optional: when provided, scopes to a single property.
export const availableConsumptionServiceTypes = async (
  userId: UserId,
  params: { propertyId?: string | null },
): Promise<TAvailableConsumptionService[]> => {
  const rows = await db
    .selectDistinct({
      code: serviceTypes.code,
      unit: serviceTypes.unit,
      sortOrder: serviceTypes.sortOrder,
    })
    .from(meters)
    .innerJoin(serviceTypes, eq(serviceTypes.id, meters.serviceTypeId))
    .innerJoin(properties, eq(properties.id, meters.propertyId))
    .innerJoin(
      propertyAccess,
      and(
        eq(propertyAccess.propertyId, meters.propertyId),
        eq(propertyAccess.userId, userId),
        isNull(propertyAccess.deletedAt),
      ),
    )
    .where(
      and(
        eq(serviceTypes.measurementType, "metered"),
        eq(serviceTypes.isActive, true),
        isNull(meters.deletedAt),
        isNull(properties.deletedAt),
        params.propertyId ? eq(meters.propertyId, params.propertyId as PropertyId) : undefined,
      ),
    )
    .orderBy(asc(serviceTypes.sortOrder));

  // unit is guaranteed non-null for metered services by the DB check constraint
  // (measurementType = 'metered') = (unit IS NOT NULL)
  return rows.filter((r) => r.unit !== null).map((r) => ({ code: r.code, unit: r.unit! }));
};

// Monthly consumption aggregation for a single metered concept (service-type code)
// across all accessible meters. Access-scoped via propertyAccess. Single batched query.
//
// Attribution runs through the explicit meter↔service link (Slice B3): a meter contributes
// only if it has an active `meter_services` link to a non-deleted service of this concept —
// no longer the implicit "same service type" match. The link is applied as an EXISTS
// semi-join, NOT a join to meter_services: joining would multiply a meter's readings by its
// link count and double the delta. Distinctness is the concept-level double-count guard —
// one meter feeding several services of the concept still counts exactly once.
//
// Algorithm: fetch all readings for contributing meters up to end-of-dateTo (no lower bound —
// we need the reading before dateFrom to compute the first month's delta). In JS: compute
// consecutive deltas per meter, assign each delta to the month of the later reading, skip
// deltas before dateFrom, sum across all meters per month.
export const monthlyConsumptionByService = async (
  userId: UserId,
  params: {
    serviceTypeCode: string;
    dateFrom: string; // "YYYY-MM-DD", inclusive
    dateTo: string; // "YYYY-MM-DD", inclusive
    propertyId?: string | null;
  },
): Promise<TMonthlyConsumptionAggregate> => {
  const months = generateMonthAxis(params.dateFrom, params.dateTo);

  // Upper bound: first instant of the month after dateTo (exclusive)
  const [toYear, toMonth] = params.dateTo.slice(0, 7).split("-").map(Number);
  const upperBound = new Date(Date.UTC(toYear!, toMonth!, 1)); // toMonth is 1-based → +0 = next month

  // The concept is matched against the LINKED service's type, not the meter's own — aliased so
  // it doesn't collide with the outer serviceTypes join (which only supplies unit / metered).
  const linkedServiceTypes = alias(serviceTypes, "linked_service_types");

  const rows = await db
    .select({
      meterId: readings.meterId,
      readAt: readings.readAt,
      valueT1: readings.valueT1,
      valueT2: readings.valueT2,
      valueT3: readings.valueT3,
      zoneCount: meters.zoneCount,
      unit: serviceTypes.unit,
    })
    .from(readings)
    .innerJoin(meters, eq(readings.meterId, meters.id))
    .innerJoin(serviceTypes, eq(serviceTypes.id, meters.serviceTypeId))
    .innerJoin(
      propertyAccess,
      and(
        eq(propertyAccess.propertyId, meters.propertyId),
        eq(propertyAccess.userId, userId),
        isNull(propertyAccess.deletedAt),
      ),
    )
    .where(
      and(
        eq(serviceTypes.measurementType, "metered"),
        isNull(meters.deletedAt),
        isNull(readings.deletedAt),
        lte(readings.readAt, upperBound),
        params.propertyId ? eq(meters.propertyId, params.propertyId as PropertyId) : undefined,
        // Contributes iff the meter feeds a non-deleted service of this concept via an active link.
        exists(
          db
            .select({ one: sql`1` })
            .from(meterServices)
            .innerJoin(
              services,
              and(eq(services.id, meterServices.serviceId), isNull(services.deletedAt)),
            )
            .innerJoin(linkedServiceTypes, eq(linkedServiceTypes.id, services.serviceTypeId))
            .where(
              and(
                eq(meterServices.meterId, meters.id),
                isNull(meterServices.deletedAt),
                eq(linkedServiceTypes.code, params.serviceTypeCode),
              ),
            ),
        ),
      ),
    )
    .orderBy(asc(readings.meterId), asc(readings.readAt));

  // --- JS aggregation ---

  // Group readings by meterId preserving the ORDER BY order
  const byMeter = new Map<
    MeterId,
    { readAt: Date; t1: number; t2: number | null; t3: number | null; zoneCount: number }[]
  >();

  for (const row of rows) {
    const meterId = row.meterId as MeterId;
    if (!byMeter.has(meterId)) byMeter.set(meterId, []);
    byMeter.get(meterId)!.push({
      readAt: new Date(row.readAt),
      t1: parseFloat(row.valueT1),
      t2: row.valueT2 !== null ? parseFloat(row.valueT2) : null,
      t3: row.valueT3 !== null ? parseFloat(row.valueT3) : null,
      zoneCount: row.zoneCount,
    });
  }

  // Accumulate monthly deltas across all meters
  const monthlyT1 = new Map<string, number>();
  const monthlyT2 = new Map<string, number>();
  const monthlyT3 = new Map<string, number>();
  let maxZoneCount = 1;

  for (const meterReadings of byMeter.values()) {
    for (const r of meterReadings) {
      if (r.zoneCount > maxZoneCount) maxZoneCount = r.zoneCount;
    }

    for (let i = 1; i < meterReadings.length; i++) {
      const prev = meterReadings[i - 1]!;
      const curr = meterReadings[i]!;
      const month = toMonthKey(curr.readAt);

      // Skip deltas that land before the requested range
      if (month < params.dateFrom.slice(0, 7) + "-01") continue;

      const deltaT1 = curr.t1 - prev.t1;
      monthlyT1.set(month, (monthlyT1.get(month) ?? 0) + deltaT1);

      if (curr.t2 !== null && prev.t2 !== null) {
        const deltaT2 = curr.t2 - prev.t2;
        monthlyT2.set(month, (monthlyT2.get(month) ?? 0) + deltaT2);
      }

      if (curr.t3 !== null && prev.t3 !== null) {
        const deltaT3 = curr.t3 - prev.t3;
        monthlyT3.set(month, (monthlyT3.get(month) ?? 0) + deltaT3);
      }
    }
  }

  // unit is guaranteed non-null for metered service types by the DB check constraint
  const unit = rows[0]?.unit ?? "units";

  const zones: TMonthlyConsumptionAggregate["zones"] = [
    {
      key: "t1",
      monthlyConsumption: months.map((m) => monthlyT1.get(m) ?? 0),
    },
  ];

  if (maxZoneCount >= 2) {
    zones.push({
      key: "t2",
      monthlyConsumption: months.map((m) => monthlyT2.get(m) ?? 0),
    });
  }

  if (maxZoneCount >= 3) {
    zones.push({
      key: "t3",
      monthlyConsumption: months.map((m) => monthlyT3.get(m) ?? 0),
    });
  }

  return { months, serviceTypeCode: params.serviceTypeCode, unit, zones };
};

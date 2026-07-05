import { and, asc, desc, eq, gt, gte, inArray, isNull, lt, lte, or, sql, sum } from "drizzle-orm";

import { db } from "@/lib/db/client";
import { toIsoDate } from "@/lib/format/date";
import { bills } from "@/lib/db/schema/bills";
import { payments } from "@/lib/db/schema/payments";
import { services } from "@/lib/db/schema/services";
import type { TServiceId } from "@/lib/db/schema/services";
import { serviceTypes } from "@/lib/db/schema/service-types";
import { properties, propertyAccess } from "@/lib/db/schema/properties";
import type { PropertyId } from "@/lib/db/schema/properties";
import { contracts } from "@/lib/db/schema/contracts";
import { tariffs } from "@/lib/db/schema/tariffs";
import type { TTariff } from "@/lib/db/schema/tariffs";
import { meters } from "@/lib/db/schema/meters";
import type { MeterId } from "@/lib/db/schema/meters";
import { meterServices } from "@/lib/db/schema/meter-services";
import { readings } from "@/lib/db/schema/readings";
import type { TReading } from "@/lib/db/schema/readings";
import { serviceByIdForUser } from "@/lib/db/access/services";
import type { UserId } from "@/lib/db/schema/auth";
import { SERVICE_TYPE_CODES, type TServiceTypeCode } from "@/features/services/service-type";
import type {
  TBalance,
  TExpenseSeriesIdentity,
  TMonthlyExpensesAggregate,
  TReadingPair,
  TServiceExpenseRow,
} from "./types";
import { computeBalance } from "./core";

// Pure functions: userId is always a parameter when access scoping is needed.
// Never read the auth session internally.

// Returns balances for a batch of properties in two parallel queries (no N+1).
// Access-scoped: only returns data for properties the userId can access via propertyAccess.
export const balancesForProperties = async (
  userId: UserId,
  propertyIds: PropertyId[],
): Promise<Map<PropertyId, TBalance>> => {
  if (propertyIds.length === 0) return new Map();

  const [billRows, paymentRows] = await Promise.all([
    db
      .select({ propertyId: services.propertyId, total: sum(bills.amount) })
      .from(bills)
      .innerJoin(services, eq(bills.serviceId, services.id))
      .innerJoin(properties, eq(services.propertyId, properties.id))
      .innerJoin(
        propertyAccess,
        and(
          eq(propertyAccess.propertyId, properties.id),
          eq(propertyAccess.userId, userId),
          isNull(propertyAccess.deletedAt),
        ),
      )
      .where(
        and(
          inArray(properties.id, propertyIds),
          isNull(bills.deletedAt),
          isNull(services.deletedAt),
          isNull(properties.deletedAt),
        ),
      )
      .groupBy(services.propertyId),

    db
      .select({ propertyId: services.propertyId, total: sum(payments.amount) })
      .from(payments)
      .innerJoin(services, eq(payments.serviceId, services.id))
      .innerJoin(properties, eq(services.propertyId, properties.id))
      .innerJoin(
        propertyAccess,
        and(
          eq(propertyAccess.propertyId, properties.id),
          eq(propertyAccess.userId, userId),
          isNull(propertyAccess.deletedAt),
        ),
      )
      .where(
        and(
          inArray(properties.id, propertyIds),
          isNull(payments.deletedAt),
          isNull(services.deletedAt),
          isNull(properties.deletedAt),
        ),
      )
      .groupBy(services.propertyId),
  ]);

  const billsMap = new Map(billRows.map((r) => [r.propertyId, r.total]));
  const paymentsMap = new Map(paymentRows.map((r) => [r.propertyId, r.total]));

  const result = new Map<PropertyId, TBalance>();
  for (const id of propertyIds) {
    result.set(id, computeBalance(billsMap.get(id) ?? null, paymentsMap.get(id) ?? null));
  }
  return result;
};

// Returns balances for a batch of services in two parallel queries (no N+1).
// No access check — only called after the caller has already verified user access
// to all services in the batch (e.g., via servicesByPropertyId or serviceByIdForUser).
// Same pattern as lastReadingsByMeterIds in lib/db/access/readings.ts.
export const balancesForServices = async (
  serviceIds: TServiceId[],
): Promise<Map<TServiceId, TBalance>> => {
  if (serviceIds.length === 0) return new Map();

  const [billRows, paymentRows] = await Promise.all([
    db
      .select({ serviceId: bills.serviceId, total: sum(bills.amount) })
      .from(bills)
      .where(and(inArray(bills.serviceId, serviceIds), isNull(bills.deletedAt)))
      .groupBy(bills.serviceId),

    db
      .select({ serviceId: payments.serviceId, total: sum(payments.amount) })
      .from(payments)
      .where(and(inArray(payments.serviceId, serviceIds), isNull(payments.deletedAt)))
      .groupBy(payments.serviceId),
  ]);

  const billsMap = new Map(billRows.map((r) => [r.serviceId, r.total]));
  const paymentsMap = new Map(paymentRows.map((r) => [r.serviceId, r.total]));

  const result = new Map<TServiceId, TBalance>();
  for (const id of serviceIds) {
    result.set(id, computeBalance(billsMap.get(id) ?? null, paymentsMap.get(id) ?? null));
  }
  return result;
};

// Single-service balance with access check. Used by server actions called from client hooks
// where serviceId comes from user input and must be re-verified.
export const balanceForService = async (
  userId: UserId,
  serviceId: TServiceId,
): Promise<TBalance | null> => {
  const access = await serviceByIdForUser(userId, serviceId);
  if (!access.ok) return null;

  const balances = await balancesForServices([serviceId]);
  return balances.get(serviceId) ?? computeBalance(null, null);
};

// Total balance across all properties accessible to the user.
// Consumed by Dashboard (future task) — built here, no UI wired yet.
export const totalBalance = async (userId: UserId): Promise<TBalance> => {
  const [billRow, paymentRow] = await Promise.all([
    db
      .select({ total: sum(bills.amount) })
      .from(bills)
      .innerJoin(services, eq(bills.serviceId, services.id))
      .innerJoin(properties, eq(services.propertyId, properties.id))
      .innerJoin(
        propertyAccess,
        and(
          eq(propertyAccess.propertyId, properties.id),
          eq(propertyAccess.userId, userId),
          isNull(propertyAccess.deletedAt),
        ),
      )
      .where(
        and(isNull(bills.deletedAt), isNull(services.deletedAt), isNull(properties.deletedAt)),
      ),

    db
      .select({ total: sum(payments.amount) })
      .from(payments)
      .innerJoin(services, eq(payments.serviceId, services.id))
      .innerJoin(properties, eq(services.propertyId, properties.id))
      .innerJoin(
        propertyAccess,
        and(
          eq(propertyAccess.propertyId, properties.id),
          eq(propertyAccess.userId, userId),
          isNull(propertyAccess.deletedAt),
        ),
      )
      .where(
        and(isNull(payments.deletedAt), isNull(services.deletedAt), isNull(properties.deletedAt)),
      ),
  ]);

  return computeBalance(billRow[0]?.total ?? null, paymentRow[0]?.total ?? null);
};

// Returns the tariff in effect for the given service at periodStart.
// Uses half-open [validFrom, validTo) semantics on both the contract and the tariff.
// At most one tariff can match due to exclusion constraints on both contracts and tariffs.
// No access check — only called from within access-controlled server actions.
export const tariffForServicePeriod = async (
  serviceId: TServiceId,
  periodStart: string, // "YYYY-MM-DD"
): Promise<TTariff | null> => {
  const ref = new Date(periodStart + "T00:00:00Z");

  const rows = await db
    .select({ tariff: tariffs })
    .from(tariffs)
    .innerJoin(contracts, eq(tariffs.contractId, contracts.id))
    .where(
      and(
        eq(contracts.serviceId, serviceId),
        isNull(contracts.deletedAt),
        isNull(tariffs.deletedAt),
        lte(contracts.validFrom, ref),
        or(isNull(contracts.validTo), gt(contracts.validTo, ref)),
        lte(tariffs.validFrom, ref),
        or(isNull(tariffs.validTo), gt(tariffs.validTo, ref)),
      ),
    )
    .orderBy(asc(tariffs.validFrom))
    .limit(1);

  return rows[0]?.tariff ?? null;
};

// Returns one reading pair (curr = most recent ≤ periodEnd, prev = the one before it) for every
// active meter that feeds this service. Used to compute the metered expected-amount hint across
// all of a service's meters, consistent with how monthlyConsumptionByService sums their deltas.
//
// Meters are resolved through the explicit meter↔service link (Slice B3), not by shared service
// type. A meter with fewer than two readings yields a pair with a null slot (the caller skips it).
// No access check — only called from within access-controlled server actions.
export const readingPairsForPeriod = async (
  serviceId: TServiceId,
  periodEnd: string, // "YYYY-MM-DD"
): Promise<TReadingPair[]> => {
  // readAt < start of (periodEnd + 1 day) ≡ readAt ≤ end of periodEnd (any time on that day)
  const dayAfter = new Date(periodEnd + "T00:00:00Z");
  dayAfter.setUTCDate(dayAfter.getUTCDate() + 1);

  // Every active linked meter joined to its readings up to periodEnd, most recent first — one
  // batched query; the two newest readings per meter form that meter's pair.
  const rows = await db
    .select({ reading: readings })
    .from(meters)
    .innerJoin(
      meterServices,
      and(
        eq(meterServices.meterId, meters.id),
        eq(meterServices.serviceId, serviceId),
        isNull(meterServices.deletedAt),
      ),
    )
    .innerJoin(
      readings,
      and(
        eq(readings.meterId, meters.id),
        lt(readings.readAt, dayAfter),
        isNull(readings.deletedAt),
      ),
    )
    .where(and(isNull(meters.validTo), isNull(meters.deletedAt)))
    .orderBy(asc(meters.id), desc(readings.readAt));

  const topTwoByMeter = new Map<MeterId, TReading[]>();
  for (const { reading } of rows) {
    const list = topTwoByMeter.get(reading.meterId) ?? [];
    if (list.length < 2) {
      list.push(reading);
      topTwoByMeter.set(reading.meterId, list);
    }
  }

  return [...topTwoByMeter.values()].map(([curr, prev]) => ({
    curr: curr ?? null,
    prev: prev ?? null,
  }));
};

// Returns the ordered list of first-of-month "YYYY-MM-DD" strings covering
// every calendar month between from and to (both inclusive, truncated to month).
const generateMonthAxis = (from: string, to: string): string[] => {
  const months: string[] = [];
  // Truncate to first of the month in UTC to avoid DST edge cases.
  const start = new Date(from.slice(0, 7) + "-01T00:00:00Z");
  const end = new Date(to.slice(0, 7) + "-01T00:00:00Z");
  const cur = new Date(start);
  while (cur <= end) {
    months.push(toIsoDate(cur));
    cur.setUTCMonth(cur.getUTCMonth() + 1);
  }
  return months;
};

// Monthly expense aggregation across all accessible services for a user (Decision #146).
// Single batched query — no N+1. Access-scoped via propertyAccess.
// Caller must supply resolved dateFrom/dateTo (no defaulting here).
export const monthlyExpensesByService = async (
  userId: UserId,
  params: {
    dateFrom: string; // YYYY-MM-DD, inclusive
    dateTo: string; // YYYY-MM-DD, inclusive
    propertyId?: string | null;
    serviceTypeCodes?: string[] | null;
  },
): Promise<TMonthlyExpensesAggregate> => {
  const { dateFrom, dateTo, propertyId, serviceTypeCodes } = params;

  // Same date-filter pattern as lib/db/access/bills.ts lines 100-101:
  // gte/lte against a "YYYY-MM-DD" string works on Drizzle date columns.
  // propertyAccess userId + deletedAt filters live in the JOIN condition (matching the
  // existing balancesForProperties pattern in this file).
  const conditions = and(
    isNull(bills.deletedAt),
    isNull(services.deletedAt),
    isNull(properties.deletedAt),
    gte(bills.periodMonth, dateFrom),
    lte(bills.periodMonth, dateTo),
    propertyId ? eq(properties.id, propertyId as PropertyId) : undefined,
    serviceTypeCodes && serviceTypeCodes.length > 0
      ? inArray(serviceTypes.code, serviceTypeCodes)
      : undefined,
  );

  // Series identity: regular types collapse by code; `other` services split by service id
  // (Slice 4). The `::text` cast gives both CASE branches a common type (uuid vs text).
  const seriesKey = sql<string>`case when ${serviceTypes.code} = ${SERVICE_TYPE_CODES.OTHER} then ${services.id}::text else ${serviceTypes.code} end`;
  const seriesName = sql<
    string | null
  >`case when ${serviceTypes.code} = ${SERVICE_TYPE_CODES.OTHER} then ${services.name} else null end`;
  const seriesServiceId = sql<
    string | null
  >`case when ${serviceTypes.code} = ${SERVICE_TYPE_CODES.OTHER} then ${services.id}::text else null end`;

  const rows = await db
    .select({
      key: seriesKey,
      code: serviceTypes.code,
      name: seriesName,
      serviceId: seriesServiceId,
      month: bills.periodMonth,
      total: sum(bills.amount),
    })
    .from(bills)
    .innerJoin(services, eq(bills.serviceId, services.id))
    .innerJoin(serviceTypes, eq(services.serviceTypeId, serviceTypes.id))
    .innerJoin(properties, eq(services.propertyId, properties.id))
    .innerJoin(
      propertyAccess,
      and(
        eq(propertyAccess.propertyId, properties.id),
        eq(propertyAccess.userId, userId),
        isNull(propertyAccess.deletedAt),
      ),
    )
    .where(conditions)
    // Group/order by SELECT-list ordinals (1=key, 3=name, 5=month) rather than by the
    // CASE fragments: Drizzle re-parameterizes an inline `sql` on each use, so repeating
    // the expression in GROUP BY renders different bind slots and Postgres won't match it
    // to the SELECT ("must appear in GROUP BY"). Ordinals point at the exact select items.
    .groupBy(sql`1, 2, 3, 4, 5`, serviceTypes.sortOrder)
    // Catalog order first; within the `other` group (one sortOrder) order by name.
    .orderBy(asc(serviceTypes.sortOrder), sql`3`, sql`5`);

  const months = generateMonthAxis(dateFrom, dateTo);

  // Accumulate per series key. The query's ORDER BY fixes series order, so the Map's
  // insertion order carries through to the result. Drizzle returns date columns as
  // "YYYY-MM-DD" strings in default (string) mode.
  type TAccum = { identity: TExpenseSeriesIdentity; amountByMonth: Map<string, number> };
  const byKey = new Map<string, TAccum>();

  for (const row of rows) {
    const { key, code, name, serviceId, month, total } = row;
    let accum = byKey.get(key);
    if (!accum) {
      const identity: TExpenseSeriesIdentity =
        code === SERVICE_TYPE_CODES.OTHER
          ? { kind: "custom", serviceId: serviceId as TServiceId, name }
          : { kind: "type", code: code as TServiceTypeCode };
      accum = { identity, amountByMonth: new Map() };
      byKey.set(key, accum);
    }
    const monthKey = String(month).slice(0, 10);
    accum.amountByMonth.set(
      monthKey,
      (accum.amountByMonth.get(monthKey) ?? 0) + parseFloat(total ?? "0"),
    );
  }

  const serviceRows: TServiceExpenseRow[] = [...byKey.entries()].map(
    ([key, { identity, amountByMonth }]) => ({
      key,
      ...identity,
      monthlyAmounts: months.map((m) => amountByMonth.get(m) ?? 0),
    }),
  );

  return { months, services: serviceRows };
};

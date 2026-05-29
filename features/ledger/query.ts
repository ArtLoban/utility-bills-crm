import { and, asc, desc, eq, gt, inArray, isNull, lt, lte, or, sum } from "drizzle-orm";

import { db } from "@/lib/db/client";
import { bills } from "@/lib/db/schema/bills";
import { payments } from "@/lib/db/schema/payments";
import { services } from "@/lib/db/schema/services";
import type { TServiceId } from "@/lib/db/schema/services";
import { properties, propertyAccess } from "@/lib/db/schema/properties";
import type { PropertyId } from "@/lib/db/schema/properties";
import { contracts } from "@/lib/db/schema/contracts";
import { tariffs } from "@/lib/db/schema/tariffs";
import type { TTariff } from "@/lib/db/schema/tariffs";
import { meters } from "@/lib/db/schema/meters";
import { readings } from "@/lib/db/schema/readings";
import { serviceByIdForUser } from "@/lib/db/access/services";
import type { UserId } from "@/lib/db/schema/auth";
import type { TBalance, TReadingPair } from "./types";
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

// Returns the last two readings for the active meter associated with a service,
// both with readAt <= periodEnd. curr = most recent, prev = the one before it.
// Used to compute metered consumption for the expected-amount hint.
// No access check — only called from within access-controlled server actions.
export const readingsForPeriod = async (
  serviceId: TServiceId,
  periodEnd: string, // "YYYY-MM-DD"
): Promise<TReadingPair> => {
  const serviceRows = await db
    .select({ propertyId: services.propertyId, serviceTypeId: services.serviceTypeId })
    .from(services)
    .where(and(eq(services.id, serviceId), isNull(services.deletedAt)))
    .limit(1);

  if (!serviceRows[0]) return { curr: null, prev: null };

  const { propertyId, serviceTypeId } = serviceRows[0];

  const meterRows = await db
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

  if (!meterRows[0]) return { curr: null, prev: null };

  // readAt < start of (periodEnd + 1 day) ≡ readAt ≤ end of periodEnd (any time on that day)
  const dayAfter = new Date(periodEnd + "T00:00:00Z");
  dayAfter.setUTCDate(dayAfter.getUTCDate() + 1);

  const readingRows = await db
    .select()
    .from(readings)
    .where(
      and(
        eq(readings.meterId, meterRows[0].id),
        lt(readings.readAt, dayAfter),
        isNull(readings.deletedAt),
      ),
    )
    .orderBy(desc(readings.readAt))
    .limit(2);

  return {
    curr: readingRows[0] ?? null,
    prev: readingRows[1] ?? null,
  };
};

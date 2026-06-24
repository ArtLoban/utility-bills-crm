import { and, eq, isNull, notInArray, sql } from "drizzle-orm";
import { unionAll } from "drizzle-orm/pg-core";

import { db } from "@/lib/db/client";
import { users } from "@/lib/db/schema/auth";
import { properties, propertyAccess, PROPERTY_ROLES } from "@/lib/db/schema/properties";
import { services } from "@/lib/db/schema/services";
import { serviceTypes } from "@/lib/db/schema/service-types";
import { bills } from "@/lib/db/schema/bills";
import { payments } from "@/lib/db/schema/payments";
import { readings } from "@/lib/db/schema/readings";
import { meters } from "@/lib/db/schema/meters";
import { requireAdmin } from "@/lib/auth/guards";
import { unwrapOrThrow } from "@/lib/unwrap-or-throw";
import { ACTIVITY_KINDS, type TActivityItem, type TActivityKind } from "./types";

const ACTIVITY_LIMIT = 20;

// Third defense-in-depth layer — same pattern as query.ts.
const assertAdmin = async (): Promise<void> => {
  await unwrapOrThrow(await requireAdmin());
};

// --- Raw row shape from the UNION ALL ---

type TActivityRawRow = {
  kind: string;
  id: string;
  occurredAt: Date;
  name: string | null;
  serviceTypeCode: string | null;
  extra: string | null;
};

// --- Pure normalization (no DB calls) ---

export const normalizeActivityRows = (rows: TActivityRawRow[]): TActivityItem[] =>
  rows
    .filter((row): row is TActivityRawRow & { kind: TActivityKind } =>
      (Object.values(ACTIVITY_KINDS) as readonly string[]).includes(row.kind),
    )
    .map((row) => ({
      kind: row.kind as TActivityKind,
      id: row.id,
      occurredAt: row.occurredAt,
      name: row.name,
      serviceTypeCode: row.serviceTypeCode,
      extra: row.extra,
    }));

// --- Query ---

export const getAdminActivityFeed = async (): Promise<TActivityItem[]> => {
  await assertAdmin();

  const nullText = sql<string | null>`NULL`;

  // Subquery: IDs of all properties owned by demo users.
  // Used to exclude demo data from every branch of the feed.
  const demoPropertyIds = db
    .select({ id: propertyAccess.propertyId })
    .from(propertyAccess)
    .innerJoin(users, eq(users.id, propertyAccess.userId))
    .where(and(eq(users.isDemo, true), eq(propertyAccess.propertyRole, PROPERTY_ROLES.OWNER)));

  const propertiesBranch = db
    .select({
      kind: sql<string>`'property'`,
      id: sql<string>`${properties.id}::text`,
      occurredAt: properties.createdAt,
      name: sql<string | null>`${properties.name}`,
      serviceTypeCode: nullText,
      extra: nullText,
    })
    .from(properties)
    .where(and(isNull(properties.deletedAt), notInArray(properties.id, demoPropertyIds)));

  const usersBranch = db
    .select({
      kind: sql<string>`'user'`,
      id: sql<string>`${users.id}::text`,
      occurredAt: users.createdAt,
      name: sql<string | null>`COALESCE(${users.name}, ${users.email})`,
      serviceTypeCode: nullText,
      extra: nullText,
    })
    .from(users)
    .where(and(isNull(users.deletedAt), eq(users.isDemo, false)));

  const servicesBranch = db
    .select({
      kind: sql<string>`'service'`,
      id: sql<string>`${services.id}::text`,
      occurredAt: services.createdAt,
      name: properties.name,
      serviceTypeCode: serviceTypes.code,
      extra: nullText,
    })
    .from(services)
    .innerJoin(properties, eq(properties.id, services.propertyId))
    .innerJoin(serviceTypes, eq(serviceTypes.id, services.serviceTypeId))
    .where(and(isNull(services.deletedAt), notInArray(properties.id, demoPropertyIds)));

  const billsBranch = db
    .select({
      kind: sql<string>`'bill'`,
      id: sql<string>`${bills.id}::text`,
      occurredAt: bills.createdAt,
      name: properties.name,
      serviceTypeCode: serviceTypes.code,
      extra: sql<string | null>`${bills.periodMonth}::text`,
    })
    .from(bills)
    .innerJoin(services, eq(services.id, bills.serviceId))
    .innerJoin(properties, eq(properties.id, services.propertyId))
    .innerJoin(serviceTypes, eq(serviceTypes.id, services.serviceTypeId))
    .where(and(isNull(bills.deletedAt), notInArray(properties.id, demoPropertyIds)));

  const paymentsBranch = db
    .select({
      kind: sql<string>`'payment'`,
      id: sql<string>`${payments.id}::text`,
      occurredAt: payments.createdAt,
      name: properties.name,
      serviceTypeCode: serviceTypes.code,
      extra: sql<string | null>`${payments.amount}::text`,
    })
    .from(payments)
    .innerJoin(services, eq(services.id, payments.serviceId))
    .innerJoin(properties, eq(properties.id, services.propertyId))
    .innerJoin(serviceTypes, eq(serviceTypes.id, services.serviceTypeId))
    .where(and(isNull(payments.deletedAt), notInArray(properties.id, demoPropertyIds)));

  const readingsBranch = db
    .select({
      kind: sql<string>`'reading'`,
      id: sql<string>`${readings.id}::text`,
      occurredAt: readings.createdAt,
      name: properties.name,
      serviceTypeCode: serviceTypes.code,
      extra: nullText,
    })
    .from(readings)
    .innerJoin(meters, eq(meters.id, readings.meterId))
    .innerJoin(properties, eq(properties.id, meters.propertyId))
    .innerJoin(serviceTypes, eq(serviceTypes.id, meters.serviceTypeId))
    .where(and(isNull(readings.deletedAt), notInArray(properties.id, demoPropertyIds)));

  const rows = await unionAll(
    propertiesBranch,
    usersBranch,
    servicesBranch,
    billsBranch,
    paymentsBranch,
    readingsBranch,
  )
    // Order by the 3rd positional column (occurredAt / created_at) across all branches.
    // Drizzle does not emit SQL aliases on UNION branches, so camelCase column references
    // like "occurredAt" are unknown to PostgreSQL at ORDER BY time.
    .orderBy(sql`3 desc`)
    .limit(ACTIVITY_LIMIT);

  return normalizeActivityRows(rows as TActivityRawRow[]);
};

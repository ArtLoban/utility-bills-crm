import { and, asc, desc, eq, isNull } from "drizzle-orm";

import { db } from "@/lib/db/client";
import { bills } from "@/lib/db/schema/bills";
import type { BillId, TBill } from "@/lib/db/schema/bills";
import { services } from "@/lib/db/schema/services";
import type { TServiceId } from "@/lib/db/schema/services";
import { serviceTypes } from "@/lib/db/schema/service-types";
import type { TServiceTypeUnit } from "@/lib/db/schema/service-types";
import { properties, propertyAccess } from "@/lib/db/schema/properties";
import type { PropertyId, TPropertyRole } from "@/lib/db/schema/properties";
import type { UserId } from "@/lib/db/schema/auth";
import { propertyByIdForUser } from "./properties";
import { NotFoundError, err, ok } from "@/lib/errors";
import type { Result } from "@/lib/errors";
import type { TServiceTypeCode } from "@/lib/constants/service-types";

// --- Result types ---

export type TBillGlobalRow = {
  bill: Pick<
    TBill,
    | "id"
    | "serviceId"
    | "periodStart"
    | "periodEnd"
    | "periodMonth"
    | "amount"
    | "notes"
    | "createdAt"
  >;
  serviceTypeCode: TServiceTypeCode;
  serviceTypeUnit: TServiceTypeUnit | null;
  property: { id: PropertyId; name: string };
  role: TPropertyRole;
};

export type TServiceOption = {
  id: TServiceId;
  typeCode: TServiceTypeCode;
  typeUnit: TServiceTypeUnit | null;
};

// --- Access helpers ---
// Pure functions: userId is always a parameter. Never read the auth session internally.

export const billsForGlobalList = async (userId: UserId): Promise<TBillGlobalRow[]> => {
  const rows = await db
    .select({
      bill: {
        id: bills.id,
        serviceId: bills.serviceId,
        periodStart: bills.periodStart,
        periodEnd: bills.periodEnd,
        periodMonth: bills.periodMonth,
        amount: bills.amount,
        notes: bills.notes,
        createdAt: bills.createdAt,
      },
      serviceTypeCode: serviceTypes.code,
      serviceTypeUnit: serviceTypes.unit,
      propertyId: properties.id,
      propertyName: properties.name,
      role: propertyAccess.propertyRole,
    })
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
    .innerJoin(serviceTypes, eq(services.serviceTypeId, serviceTypes.id))
    .where(and(isNull(bills.deletedAt), isNull(properties.deletedAt)))
    .orderBy(desc(bills.createdAt));

  return rows.map((r) => ({
    bill: r.bill,
    serviceTypeCode: r.serviceTypeCode as TServiceTypeCode,
    serviceTypeUnit: r.serviceTypeUnit,
    property: { id: r.propertyId, name: r.propertyName },
    role: r.role,
  }));
};

export const billByIdForUser = async (
  userId: UserId,
  billId: BillId,
): Promise<Result<TBillGlobalRow, NotFoundError>> => {
  const rows = await db
    .select({
      bill: {
        id: bills.id,
        serviceId: bills.serviceId,
        periodStart: bills.periodStart,
        periodEnd: bills.periodEnd,
        periodMonth: bills.periodMonth,
        amount: bills.amount,
        notes: bills.notes,
        createdAt: bills.createdAt,
      },
      serviceTypeCode: serviceTypes.code,
      serviceTypeUnit: serviceTypes.unit,
      propertyId: properties.id,
      propertyName: properties.name,
      role: propertyAccess.propertyRole,
    })
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
    .innerJoin(serviceTypes, eq(services.serviceTypeId, serviceTypes.id))
    .where(and(eq(bills.id, billId), isNull(bills.deletedAt), isNull(properties.deletedAt)))
    .limit(1);

  // Decision #108: inaccessible bill is indistinguishable from a nonexistent one.
  if (rows.length === 0) return err(new NotFoundError("bill", billId));

  const r = rows[0]!;
  return ok({
    bill: r.bill,
    serviceTypeCode: r.serviceTypeCode as TServiceTypeCode,
    serviceTypeUnit: r.serviceTypeUnit,
    property: { id: r.propertyId, name: r.propertyName },
    role: r.role,
  });
};

// Returns a map of propertyId → services for populating the Add/Edit Bill modal dropdowns.
// Includes all active services for accessible properties, even those with no bills.
export const servicesForBillForm = async (
  userId: UserId,
): Promise<Record<PropertyId, TServiceOption[]>> => {
  const rows = await db
    .select({
      propertyId: properties.id,
      serviceId: services.id,
      serviceTypeCode: serviceTypes.code,
      serviceTypeUnit: serviceTypes.unit,
    })
    .from(services)
    .innerJoin(properties, eq(services.propertyId, properties.id))
    .innerJoin(
      propertyAccess,
      and(
        eq(propertyAccess.propertyId, properties.id),
        eq(propertyAccess.userId, userId),
        isNull(propertyAccess.deletedAt),
      ),
    )
    .innerJoin(serviceTypes, eq(services.serviceTypeId, serviceTypes.id))
    .where(and(isNull(services.deletedAt), isNull(properties.deletedAt)))
    .orderBy(asc(properties.name), asc(serviceTypes.sortOrder));

  const result: Record<PropertyId, TServiceOption[]> = {};
  for (const row of rows) {
    const existing = result[row.propertyId];
    const option: TServiceOption = {
      id: row.serviceId,
      typeCode: row.serviceTypeCode as TServiceTypeCode,
      typeUnit: row.serviceTypeUnit,
    };
    if (existing) {
      existing.push(option);
    } else {
      result[row.propertyId] = [option];
    }
  }
  return result;
};

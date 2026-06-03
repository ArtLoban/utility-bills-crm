import { and, asc, count, desc, eq, gte, inArray, isNull, lte, sum } from "drizzle-orm";

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
import { NotFoundError, err, ok } from "@/lib/errors";
import type { Result } from "@/lib/errors";
import type { TServiceTypeCode } from "@/features/services/service-type";
import type { TBillsListParams } from "@/features/bills/types";
import { TServerPagination } from "@/lib/types/data-table";

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

export type TBillsListResult = {
  data: TBillGlobalRow[];
  pagination: TServerPagination;
  totals: { amount: string };
};

export type TServiceOption = {
  id: TServiceId;
  typeCode: TServiceTypeCode;
  typeUnit: TServiceTypeUnit | null;
};

// --- Shared select shape ---

const BILL_SELECT = {
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
} as const;

// Intermediate shape returned by the DB query before the property fields are nested.
// serviceTypeCode is string here — toRow() narrows it to TServiceTypeCode.
type TRawRow = Omit<TBillGlobalRow, "property" | "serviceTypeCode"> & {
  serviceTypeCode: string;
  propertyId: PropertyId;
  propertyName: string;
};

const toRow = (r: TRawRow): TBillGlobalRow => ({
  bill: r.bill,
  serviceTypeCode: r.serviceTypeCode as TServiceTypeCode,
  serviceTypeUnit: r.serviceTypeUnit,
  property: { id: r.propertyId, name: r.propertyName },
  role: r.role,
});

// Builds the WHERE conditions array for the bills list query.
const buildConditions = (userId: UserId, params: TBillsListParams) => {
  const conds = [
    isNull(bills.deletedAt),
    isNull(properties.deletedAt),
    eq(propertyAccess.userId, userId),
    isNull(propertyAccess.deletedAt),
  ];

  if (params.propertyId) conds.push(eq(properties.id, params.propertyId as PropertyId));
  if (params.services?.length) conds.push(inArray(serviceTypes.code, params.services));
  if (params.dateFrom) conds.push(gte(bills.periodMonth, params.dateFrom));
  if (params.dateTo) conds.push(lte(bills.periodMonth, params.dateTo));

  return and(...conds);
};

// Builds the ORDER BY clause. Default: periodMonth DESC, createdAt DESC.
const buildOrderBy = (params: TBillsListParams) => {
  const dir = params.sortOrder === "asc" ? asc : desc;
  switch (params.sortBy) {
    case "amount":
      return [dir(bills.amount), desc(bills.createdAt)] as const;
    case "createdAt":
      return [dir(bills.createdAt)] as const;
    case "periodMonth":
    default:
      return [dir(bills.periodMonth), desc(bills.createdAt)] as const;
  }
};

// --- Access helpers ---
// Pure functions: userId is always a parameter. Never read the auth session internally.

export const getBillsList = async (
  userId: UserId,
  params: TBillsListParams,
): Promise<TBillsListResult> => {
  const where = buildConditions(userId, params);
  const orderBy = buildOrderBy(params);
  const offset = (params.page - 1) * params.pageSize;

  // Three queries run in parallel: total count, sum of all filtered amounts, paginated page.
  const [countResult, sumResult, rows] = await Promise.all([
    db
      .select({ total: count() })
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
      .where(where),

    db
      .select({ totalAmount: sum(bills.amount) })
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
      .where(where),

    db
      .select(BILL_SELECT)
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
      .where(where)
      .orderBy(...orderBy)
      .limit(params.pageSize)
      .offset(offset),
  ]);

  const total = countResult[0]?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / params.pageSize));

  return {
    data: rows.map(toRow),
    pagination: { page: params.page, pageSize: params.pageSize, total, totalPages },
    totals: { amount: sumResult[0]?.totalAmount ?? "0" },
  };
};

export const billByIdForUser = async (
  userId: UserId,
  billId: BillId,
): Promise<Result<TBillGlobalRow, NotFoundError>> => {
  const rows = await db
    .select(BILL_SELECT)
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

  return ok(toRow(rows[0]!));
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

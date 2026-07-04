import { and, asc, count, desc, eq, gte, inArray, isNull, lte, sum } from "drizzle-orm";

import { db } from "@/lib/db/client";
import { bills } from "@/lib/db/schema/bills";
import type { BillId, TBill } from "@/lib/db/schema/bills";
import { services } from "@/lib/db/schema/services";
import type { TServiceId } from "@/lib/db/schema/services";
import { serviceTypes } from "@/lib/db/schema/service-types";
import type { TServiceTypeUnit } from "@/lib/db/schema/service-types";
import { contracts } from "@/lib/db/schema/contracts";
import { providers } from "@/lib/db/schema/providers";
import { accountNumbers } from "@/lib/db/schema/account-numbers";
import { properties, propertyAccess } from "@/lib/db/schema/properties";
import type { PropertyId, TPropertyRole, TPropertyType } from "@/lib/db/schema/properties";
import type { UserId } from "@/lib/db/schema/auth";
import { appError, err, ok } from "@/lib/errors";
import type { Result, TAppError } from "@/lib/errors";
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
  serviceName: string | null;
  property: { id: PropertyId; name: string; type: TPropertyType };
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
  name: string | null;
  providerName: string | null;
  accountNumber: string | null;
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
  serviceName: services.name,
  propertyId: properties.id,
  propertyName: properties.name,
  propertyType: properties.type,
  role: propertyAccess.propertyRole,
} as const;

// Intermediate shape returned by the DB query before the property fields are nested.
// serviceTypeCode is string here — toRow() narrows it to TServiceTypeCode.
type TRawRow = Omit<TBillGlobalRow, "property" | "serviceTypeCode"> & {
  serviceTypeCode: string;
  propertyId: PropertyId;
  propertyName: string;
  propertyType: TPropertyType;
};

const toRow = (r: TRawRow): TBillGlobalRow => ({
  bill: r.bill,
  serviceTypeCode: r.serviceTypeCode as TServiceTypeCode,
  serviceTypeUnit: r.serviceTypeUnit,
  serviceName: r.serviceName,
  property: { id: r.propertyId, name: r.propertyName, type: r.propertyType },
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
  if (params.serviceId) conds.push(eq(services.id, params.serviceId as TServiceId));
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
    case "property":
      return [dir(properties.name), desc(bills.periodMonth)] as const;
    case "service":
      return [dir(serviceTypes.sortOrder), desc(bills.periodMonth)] as const;
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
): Promise<Result<TBillGlobalRow, TAppError>> => {
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
  if (rows.length === 0) return err(appError.notFound("bill", billId));

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
      serviceName: services.name,
      serviceTypeCode: serviceTypes.code,
      serviceTypeUnit: serviceTypes.unit,
      providerName: providers.name,
      accountNumber: accountNumbers.value,
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
    // Current contract (validTo IS NULL) → its provider, and the contract's current
    // account number. All LEFT joins: a service may have no active contract/account yet.
    .leftJoin(
      contracts,
      and(
        eq(contracts.serviceId, services.id),
        isNull(contracts.validTo),
        isNull(contracts.deletedAt),
      ),
    )
    .leftJoin(providers, eq(providers.id, contracts.providerId))
    .leftJoin(
      accountNumbers,
      and(
        eq(accountNumbers.contractId, contracts.id),
        isNull(accountNumbers.validTo),
        isNull(accountNumbers.deletedAt),
      ),
    )
    .where(and(isNull(services.deletedAt), isNull(properties.deletedAt)))
    .orderBy(asc(properties.name), asc(serviceTypes.sortOrder));

  const result: Record<PropertyId, TServiceOption[]> = {};
  for (const row of rows) {
    const existing = result[row.propertyId];
    const option: TServiceOption = {
      id: row.serviceId,
      typeCode: row.serviceTypeCode as TServiceTypeCode,
      typeUnit: row.serviceTypeUnit,
      name: row.serviceName,
      providerName: row.providerName,
      accountNumber: row.accountNumber,
    };
    if (existing) {
      existing.push(option);
    } else {
      result[row.propertyId] = [option];
    }
  }
  return result;
};

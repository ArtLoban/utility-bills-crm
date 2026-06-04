import { and, asc, count, desc, eq, gte, inArray, isNull, lte, sum } from "drizzle-orm";

import { db } from "@/lib/db/client";
import { payments } from "@/lib/db/schema/payments";
import type { PaymentId } from "@/lib/db/schema/payments";
import { services } from "@/lib/db/schema/services";
import type { TServiceId } from "@/lib/db/schema/services";
import { serviceTypes } from "@/lib/db/schema/service-types";
import type { TServiceTypeUnit } from "@/lib/db/schema/service-types";
import { properties, propertyAccess } from "@/lib/db/schema/properties";
import type { PropertyId } from "@/lib/db/schema/properties";
import type { UserId } from "@/lib/db/schema/auth";
import { NotFoundError, err, ok } from "@/lib/errors";
import type { Result } from "@/lib/errors";
import type { TServiceTypeCode } from "@/features/services/service-type";
import type {
  TPaymentsListParams,
  TPaymentsListResult,
  TPaymentGlobalRow,
} from "@/features/payments/types";

// --- Service option type for form dropdowns ---
// Mirrors lib/db/access/bills.ts:TServiceOption — same shape, no cross-import.

export type TServiceOption = {
  id: TServiceId;
  typeCode: TServiceTypeCode;
  typeUnit: TServiceTypeUnit | null;
};

// --- Shared select shape ---

const PAYMENT_SELECT = {
  payment: {
    id: payments.id,
    serviceId: payments.serviceId,
    paidAt: payments.paidAt,
    amount: payments.amount,
    notes: payments.notes,
    createdAt: payments.createdAt,
  },
  serviceTypeCode: serviceTypes.code,
  serviceTypeUnit: serviceTypes.unit,
  propertyId: properties.id,
  propertyName: properties.name,
  role: propertyAccess.propertyRole,
} as const;

// Intermediate shape before property fields are nested. serviceTypeCode is string
// from the DB — toRow() narrows it to TServiceTypeCode.
type TRawRow = Omit<TPaymentGlobalRow, "property" | "serviceTypeCode"> & {
  serviceTypeCode: string;
  propertyId: PropertyId;
  propertyName: string;
};

const toRow = (r: TRawRow): TPaymentGlobalRow => ({
  payment: r.payment,
  serviceTypeCode: r.serviceTypeCode as TServiceTypeCode,
  serviceTypeUnit: r.serviceTypeUnit,
  property: { id: r.propertyId, name: r.propertyName },
  role: r.role,
});

// Builds the WHERE conditions array for the payments list query.
const buildConditions = (userId: UserId, params: TPaymentsListParams) => {
  const conds = [
    isNull(payments.deletedAt),
    isNull(properties.deletedAt),
    eq(propertyAccess.userId, userId),
    isNull(propertyAccess.deletedAt),
  ];

  if (params.propertyId) conds.push(eq(properties.id, params.propertyId as PropertyId));
  if (params.services?.length) conds.push(inArray(serviceTypes.code, params.services));
  if (params.dateFrom) conds.push(gte(payments.paidAt, params.dateFrom));
  if (params.dateTo) conds.push(lte(payments.paidAt, params.dateTo));

  return and(...conds);
};

// Builds the ORDER BY clause. Default: paidAt DESC, createdAt DESC.
const buildOrderBy = (params: TPaymentsListParams) => {
  const dir = params.sortOrder === "asc" ? asc : desc;
  switch (params.sortBy) {
    case "amount":
      return [dir(payments.amount), desc(payments.createdAt)] as const;
    case "createdAt":
      return [dir(payments.createdAt)] as const;
    case "property":
      return [dir(properties.name), desc(payments.paidAt)] as const;
    case "service":
      return [dir(serviceTypes.sortOrder), desc(payments.paidAt)] as const;
    case "paidAt":
    default:
      return [dir(payments.paidAt), desc(payments.createdAt)] as const;
  }
};

// --- Access helpers ---
// Pure functions: userId is always a parameter. Never read the auth session internally.

export const getPaymentsList = async (
  userId: UserId,
  params: TPaymentsListParams,
): Promise<TPaymentsListResult> => {
  const where = buildConditions(userId, params);
  const orderBy = buildOrderBy(params);
  const offset = (params.page - 1) * params.pageSize;

  // Three queries run in parallel: total count, sum of all filtered amounts, paginated page.
  const [countResult, sumResult, rows] = await Promise.all([
    db
      .select({ total: count() })
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
      .innerJoin(serviceTypes, eq(services.serviceTypeId, serviceTypes.id))
      .where(where),

    db
      .select({ totalAmount: sum(payments.amount) })
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
      .innerJoin(serviceTypes, eq(services.serviceTypeId, serviceTypes.id))
      .where(where),

    db
      .select(PAYMENT_SELECT)
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

export const paymentByIdForUser = async (
  userId: UserId,
  paymentId: PaymentId,
): Promise<Result<TPaymentGlobalRow, NotFoundError>> => {
  const rows = await db
    .select(PAYMENT_SELECT)
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
    .innerJoin(serviceTypes, eq(services.serviceTypeId, serviceTypes.id))
    .where(
      and(eq(payments.id, paymentId), isNull(payments.deletedAt), isNull(properties.deletedAt)),
    )
    .limit(1);

  // Decision #108: inaccessible payment is indistinguishable from a nonexistent one.
  if (rows.length === 0) return err(new NotFoundError("payment", paymentId));

  return ok(toRow(rows[0]!));
};

// Returns a map of propertyId → services for the Record Payment form dropdowns.
// Includes all active services for accessible properties, even those with no payments yet.
export const servicesForPaymentForm = async (
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

import { and, asc, count, desc, eq, inArray, isNotNull, isNull, sql } from "drizzle-orm";

import { db } from "@/lib/db/client";
import { users } from "@/lib/db/schema/auth";
import type { UserId } from "@/lib/db/schema/auth";
import { properties, propertyAccess, PROPERTY_ROLES } from "@/lib/db/schema/properties";
import type { PropertyId } from "@/lib/db/schema/properties";
import { services } from "@/lib/db/schema/services";
import { requireAdmin } from "@/lib/auth/guards";
import { unwrapOrThrow } from "@/lib/unwrap-or-throw";
import type {
  TAdminPropertiesListParams,
  TAdminPropertiesListResult,
  TAdminPropertyDetail,
  TAdminPropertyOwner,
  TAdminPropertyOwnerDetail,
  TAdminPropertyRow,
} from "./types";

// Layer 3 admin guard — mirrors admin-users/query.ts.
// Layer 1: (admin) layout guard. Layer 2: page-level requireAdmin(). Layer 3: here.
const assertAdmin = async (): Promise<void> => {
  await unwrapOrThrow(await requireAdmin());
};

const buildWhere = (params: TAdminPropertiesListParams) => {
  const conds = [];
  if (params.status === "active") conds.push(isNull(properties.deletedAt));
  else if (params.status === "deleted") conds.push(isNotNull(properties.deletedAt));
  if (params.type) conds.push(eq(properties.type, params.type));
  return conds.length > 0 ? and(...conds) : undefined;
};

const buildOrderBy = (params: TAdminPropertiesListParams) => {
  const dir = params.sortOrder === "asc" ? asc : desc;
  switch (params.sortBy) {
    case "name":
      return [dir(properties.name), asc(properties.id)] as const;
    case "type":
      return [dir(properties.type), asc(properties.id)] as const;
    case "status":
      // active (NULL deletedAt) first on asc, deleted first on desc.
      // nullsFirst/nullsLast are index-context methods in Drizzle, so raw SQL is used here.
      return params.sortOrder === "asc"
        ? ([sql`${properties.deletedAt} ASC NULLS FIRST`, asc(properties.id)] as const)
        : ([sql`${properties.deletedAt} DESC NULLS LAST`, asc(properties.id)] as const);
    case "createdAt":
    default:
      return [dir(properties.createdAt), asc(properties.id)] as const;
  }
};

export const getAdminPropertiesList = async (
  params: TAdminPropertiesListParams,
): Promise<TAdminPropertiesListResult> => {
  await assertAdmin();

  // `owner` filter: restrict to properties where this user has an active owner role.
  // Build as a subquery so the main WHERE stays composable.
  const ownerIds = params.owner
    ? db
        .select({ propertyId: propertyAccess.propertyId })
        .from(propertyAccess)
        .where(
          and(
            eq(propertyAccess.userId, params.owner as UserId),
            eq(propertyAccess.propertyRole, PROPERTY_ROLES.OWNER),
            isNull(propertyAccess.deletedAt),
          ),
        )
    : null;

  const baseWhere = buildWhere(params);
  const where = ownerIds !== null ? and(baseWhere, inArray(properties.id, ownerIds)) : baseWhere;

  const orderBy = buildOrderBy(params);
  const offset = (params.page - 1) * params.pageSize;

  const [countResult, rows] = await Promise.all([
    db.select({ total: count() }).from(properties).where(where),
    db
      .select({
        id: properties.id,
        name: properties.name,
        type: properties.type,
        createdAt: properties.createdAt,
        deletedAt: properties.deletedAt,
      })
      .from(properties)
      .where(where)
      .orderBy(...orderBy)
      .limit(params.pageSize)
      .offset(offset),
  ]);

  const total = countResult[0]?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / params.pageSize));

  if (rows.length === 0) {
    return {
      data: [],
      pagination: { page: params.page, pageSize: params.pageSize, total, totalPages },
    };
  }

  const pageIds = rows.map((r) => r.id);

  // Batch-fetch active services counts — avoids N+1 without complex GROUP BY in main query.
  const [serviceCountRows, ownerRows] = await Promise.all([
    db
      .select({ propertyId: services.propertyId, servicesCount: count(services.id) })
      .from(services)
      .where(and(inArray(services.propertyId, pageIds), isNull(services.deletedAt)))
      .groupBy(services.propertyId),

    // Batch-fetch owners for the page's property IDs.
    db
      .select({
        propertyId: propertyAccess.propertyId,
        userId: users.id,
        userName: users.name,
        userEmail: users.email,
        userIsDemo: users.isDemo,
      })
      .from(propertyAccess)
      .innerJoin(users, eq(users.id, propertyAccess.userId))
      .where(
        and(
          inArray(propertyAccess.propertyId, pageIds),
          eq(propertyAccess.propertyRole, PROPERTY_ROLES.OWNER),
          isNull(propertyAccess.deletedAt),
        ),
      ),
  ]);

  const serviceCountMap = new Map<string, number>(
    serviceCountRows.map((r) => [r.propertyId, r.servicesCount]),
  );
  const ownerMap = new Map<string, TAdminPropertyOwner[]>();
  for (const row of ownerRows) {
    const list = ownerMap.get(row.propertyId) ?? [];
    list.push({ id: row.userId, name: row.userName, email: row.userEmail, isDemo: row.userIsDemo });
    ownerMap.set(row.propertyId, list);
  }

  const data: TAdminPropertyRow[] = rows.map((row) => ({
    id: row.id,
    name: row.name,
    type: row.type,
    createdAt: row.createdAt,
    deletedAt: row.deletedAt,
    owners: ownerMap.get(row.id) ?? [],
    servicesCount: serviceCountMap.get(row.id) ?? 0,
  }));

  return {
    data,
    pagination: { page: params.page, pageSize: params.pageSize, total, totalPages },
  };
};

export const getAdminPropertyDetail = async (id: string): Promise<TAdminPropertyDetail | null> => {
  await assertAdmin();

  // Admin scope: no deletedAt filter — admin can view soft-deleted properties.
  const propertyRows = await db
    .select()
    .from(properties)
    .where(eq(properties.id, id as PropertyId))
    .limit(1);

  if (propertyRows.length === 0) return null;
  const property = propertyRows[0]!;

  const [accessRows, serviceCount] = await Promise.all([
    db
      .select({
        userId: users.id,
        userName: users.name,
        userEmail: users.email,
        userIsDemo: users.isDemo,
        propertyRole: propertyAccess.propertyRole,
      })
      .from(propertyAccess)
      .innerJoin(users, eq(users.id, propertyAccess.userId))
      .where(
        and(eq(propertyAccess.propertyId, id as PropertyId), isNull(propertyAccess.deletedAt)),
      ),

    db
      .select({ servicesCount: count(services.id) })
      .from(services)
      .where(and(eq(services.propertyId, id as PropertyId), isNull(services.deletedAt))),
  ]);

  const owners: TAdminPropertyOwnerDetail[] = accessRows.map((row) => ({
    id: row.userId,
    name: row.userName,
    email: row.userEmail,
    isDemo: row.userIsDemo,
    propertyRole: row.propertyRole,
  }));

  return {
    id: property.id,
    name: property.name,
    type: property.type,
    address: property.address,
    notes: property.notes,
    createdAt: property.createdAt,
    updatedAt: property.updatedAt,
    deletedAt: property.deletedAt,
    owners,
    servicesCount: serviceCount[0]?.servicesCount ?? 0,
  };
};

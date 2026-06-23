import { and, asc, count, desc, eq, isNotNull, isNull } from "drizzle-orm";

import { db } from "@/lib/db/client";
import { users } from "@/lib/db/schema/auth";
import type { UserId } from "@/lib/db/schema/auth";
import { properties, propertyAccess } from "@/lib/db/schema/properties";
import { requireAdmin } from "@/lib/auth/guards";
import { unwrapOrThrow } from "@/lib/unwrap-or-throw";
import {
  ADMIN_USER_SORT_COLUMNS,
  ADMIN_USER_STATUS_FILTERS,
  type TAdminUserDetailResult,
  type TAdminUserPropertyAccess,
  type TAdminUserRow,
  type TAdminUsersListParams,
  type TAdminUsersListResult,
} from "./types";

// Verifies admin session as a third defense-in-depth layer.
// Layer 1: (admin) layout guard. Layer 2: page-level requireAdmin(). Layer 3: here.
const assertAdmin = async (): Promise<void> => {
  await unwrapOrThrow(await requireAdmin());
};

const buildWhere = (params: TAdminUsersListParams) => {
  const conds = [];
  if (params.status === ADMIN_USER_STATUS_FILTERS.ACTIVE) conds.push(isNull(users.deletedAt));
  else if (params.status === ADMIN_USER_STATUS_FILTERS.DELETED) {
    conds.push(isNotNull(users.deletedAt));
  }
  if (params.systemRole) conds.push(eq(users.systemRole, params.systemRole));
  return conds.length > 0 ? and(...conds) : undefined;
};

const buildOrderBy = (params: TAdminUsersListParams) => {
  const dir = params.sortOrder === "asc" ? asc : desc;
  switch (params.sortBy) {
    case ADMIN_USER_SORT_COLUMNS.EMAIL:
      return [dir(users.email), asc(users.id)] as const;
    case ADMIN_USER_SORT_COLUMNS.NAME:
      return [dir(users.name), asc(users.id)] as const;
    case ADMIN_USER_SORT_COLUMNS.LAST_LOGIN_AT:
      return [dir(users.lastLoginAt), desc(users.createdAt)] as const;
    case ADMIN_USER_SORT_COLUMNS.CREATED_AT:
    default:
      return [dir(users.createdAt), asc(users.id)] as const;
  }
};

export const getAdminUsersList = async (
  params: TAdminUsersListParams,
): Promise<TAdminUsersListResult> => {
  await assertAdmin();

  const where = buildWhere(params);
  const orderBy = buildOrderBy(params);
  const offset = (params.page - 1) * params.pageSize;

  const [countResult, rows] = await Promise.all([
    db.select({ total: count() }).from(users).where(where),

    db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        systemRole: users.systemRole,
        isDemo: users.isDemo,
        createdAt: users.createdAt,
        lastLoginAt: users.lastLoginAt,
        deletedAt: users.deletedAt,
        propertiesCount: count(propertyAccess.id),
      })
      .from(users)
      .leftJoin(
        propertyAccess,
        and(eq(propertyAccess.userId, users.id), isNull(propertyAccess.deletedAt)),
      )
      .where(where)
      .groupBy(users.id)
      .orderBy(...orderBy)
      .limit(params.pageSize)
      .offset(offset),
  ]);

  const total = countResult[0]?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / params.pageSize));

  const data: TAdminUserRow[] = rows.map((row) => ({
    id: row.id,
    email: row.email,
    name: row.name,
    systemRole: row.systemRole,
    isDemo: row.isDemo,
    createdAt: row.createdAt,
    lastLoginAt: row.lastLoginAt,
    deletedAt: row.deletedAt,
    propertiesCount: row.propertiesCount,
  }));

  return {
    data,
    pagination: { page: params.page, pageSize: params.pageSize, total, totalPages },
  };
};

export const getAdminUserDetail = async (
  userId: string,
): Promise<TAdminUserDetailResult | null> => {
  await assertAdmin();

  const userRows = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      systemRole: users.systemRole,
      isDemo: users.isDemo,
      createdAt: users.createdAt,
      lastLoginAt: users.lastLoginAt,
      deletedAt: users.deletedAt,
    })
    .from(users)
    .where(eq(users.id, userId as UserId))
    .limit(1);

  if (userRows.length === 0) return null;
  const user = userRows[0]!;

  const accessRows = await db
    .select({
      propertyId: properties.id,
      propertyName: properties.name,
      propertyType: properties.type,
      propertyRole: propertyAccess.propertyRole,
      propertyDeletedAt: properties.deletedAt,
    })
    .from(propertyAccess)
    .innerJoin(properties, eq(propertyAccess.propertyId, properties.id))
    .where(and(eq(propertyAccess.userId, userId as UserId), isNull(propertyAccess.deletedAt)))
    .orderBy(asc(properties.name));

  const userProperties: TAdminUserPropertyAccess[] = accessRows.map((row) => ({
    propertyId: row.propertyId,
    propertyName: row.propertyName,
    propertyType: row.propertyType,
    propertyRole: row.propertyRole,
    propertyDeletedAt: row.propertyDeletedAt,
  }));

  return { ...user, properties: userProperties };
};

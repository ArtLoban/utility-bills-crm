import type { TSystemRole } from "@/lib/auth/constants";
import type { TPropertyRole, TPropertyType } from "@/lib/db/schema/properties";
import type { TServerPagination } from "@/lib/types/data-table";

export const ADMIN_USER_SORT_COLUMNS = {
  EMAIL: "email",
  NAME: "name",
  CREATED_AT: "createdAt",
  LAST_LOGIN_AT: "lastLoginAt",
} as const;
export type TAdminUsersSortColumn =
  (typeof ADMIN_USER_SORT_COLUMNS)[keyof typeof ADMIN_USER_SORT_COLUMNS];

export const ADMIN_USERS_FILTERS = {
  ROLE: "systemRole",
  STATUS: "status",
} as const;

export const ADMIN_USER_STATUS_FILTERS = {
  ACTIVE: "active",
  DELETED: "deleted",
  ALL: "all",
} as const;
export type TAdminUserStatusFilter =
  (typeof ADMIN_USER_STATUS_FILTERS)[keyof typeof ADMIN_USER_STATUS_FILTERS];

export type TAdminUsersListParams = {
  page: number;
  pageSize: number;
  sortBy: TAdminUsersSortColumn;
  sortOrder: "asc" | "desc";
  systemRole: TSystemRole | null;
  status: TAdminUserStatusFilter;
};

export type TAdminUserRow = {
  id: string;
  email: string;
  name: string | null;
  systemRole: TSystemRole;
  isDemo: boolean;
  propertiesCount: number;
  createdAt: Date;
  lastLoginAt: Date | null;
  deletedAt: Date | null;
};

export type TAdminUsersListResult = {
  data: TAdminUserRow[];
  pagination: TServerPagination;
};

export type TAdminUserPropertyAccess = {
  propertyId: string;
  propertyName: string;
  propertyType: TPropertyType;
  propertyRole: TPropertyRole;
  propertyDeletedAt: Date | null;
};

export type TAdminUserDetailResult = {
  id: string;
  email: string;
  name: string | null;
  systemRole: TSystemRole;
  isDemo: boolean;
  createdAt: Date;
  lastLoginAt: Date | null;
  deletedAt: Date | null;
  properties: TAdminUserPropertyAccess[];
};

export { type TServerPagination as TAdminUsersPagination };

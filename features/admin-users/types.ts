import type { TSystemRole } from "@/lib/auth/constants";
import type { TPropertyRole, TPropertyType } from "@/lib/db/schema/properties";
import type { TServerPagination } from "@/lib/types/data-table";

export const ADMIN_USERS_SORT_COLUMNS = ["email", "name", "createdAt", "lastLoginAt"] as const;
export type TAdminUsersSortColumn = (typeof ADMIN_USERS_SORT_COLUMNS)[number];

export type TAdminUsersListParams = {
  page: number;
  pageSize: number;
  sortBy: TAdminUsersSortColumn;
  sortOrder: "asc" | "desc";
  role?: TSystemRole;
  status: "active" | "deleted" | "all";
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

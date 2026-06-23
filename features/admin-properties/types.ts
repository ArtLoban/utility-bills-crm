import type { PropertyId, TPropertyRole, TPropertyType } from "@/lib/db/schema/properties";
import type { TServerPagination } from "@/lib/types/data-table";

export const ADMIN_PROPERTY_SORT_COLUMNS = {
  NAME: "name",
  TYPE: "type",
  CREATED_AT: "createdAt",
  STATUS: "status",
} as const;
export type TAdminPropertiesSortColumn =
  (typeof ADMIN_PROPERTY_SORT_COLUMNS)[keyof typeof ADMIN_PROPERTY_SORT_COLUMNS];
export const ADMIN_PROPERTIES_SORT_COLUMNS: readonly TAdminPropertiesSortColumn[] = Object.values(
  ADMIN_PROPERTY_SORT_COLUMNS,
);

export const ADMIN_PROPERTIES_FILTERS = {
  STATUS: "status",
  TYPE: "type",
  OWNER: "owner",
} as const;

export const ADMIN_PROPERTY_STATUS_FILTERS = {
  ACTIVE: "active",
  DELETED: "deleted",
  ALL: "all",
} as const;
export type TAdminPropertyStatusFilter =
  (typeof ADMIN_PROPERTY_STATUS_FILTERS)[keyof typeof ADMIN_PROPERTY_STATUS_FILTERS];

export type TAdminPropertyOwner = {
  id: string;
  name: string | null;
  email: string;
  isDemo: boolean;
};

export type TAdminPropertyRow = {
  id: PropertyId;
  name: string;
  type: TPropertyType;
  createdAt: Date;
  deletedAt: Date | null;
  owners: TAdminPropertyOwner[];
  servicesCount: number;
};

export type TAdminPropertiesListParams = {
  page: number;
  pageSize: number;
  sortBy: TAdminPropertiesSortColumn;
  sortOrder: "asc" | "desc";
  status: TAdminPropertyStatusFilter;
  owner?: string;
  type?: TPropertyType;
};

export type TAdminPropertiesListResult = {
  data: TAdminPropertyRow[];
  pagination: TServerPagination;
};

export type TAdminPropertyOwnerDetail = TAdminPropertyOwner & {
  propertyRole: TPropertyRole;
};

export type TAdminPropertyDetail = {
  id: PropertyId;
  name: string;
  type: TPropertyType;
  address: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  owners: TAdminPropertyOwnerDetail[];
  servicesCount: number;
};

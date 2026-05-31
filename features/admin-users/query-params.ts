import { SYSTEM_ROLES } from "@/lib/auth/constants";
import type { TSystemRole } from "@/lib/auth/constants";
import { ADMIN_USERS_SORT_COLUMNS } from "./types";
import type { TAdminUsersListParams, TAdminUsersSortColumn } from "./types";

const PAGE_SIZE_MAX = 100;
const PAGE_SIZE_DEFAULT = 25;

const parseIntGte1 = (raw: string | undefined, fallback: number): number => {
  const n = raw !== undefined ? parseInt(raw, 10) : NaN;
  return Number.isFinite(n) && n >= 1 ? n : fallback;
};

const parseSortBy = (raw: string | undefined): TAdminUsersSortColumn => {
  const cols: readonly string[] = ADMIN_USERS_SORT_COLUMNS;
  return cols.includes(raw ?? "") ? (raw as TAdminUsersSortColumn) : "createdAt";
};

const parseSortOrder = (raw: string | undefined): "asc" | "desc" =>
  raw === "asc" ? "asc" : "desc";

const parseRole = (raw: string | undefined): TSystemRole | undefined => {
  if (raw === SYSTEM_ROLES.ADMIN || raw === SYSTEM_ROLES.USER) return raw;
  return undefined;
};

const parseStatus = (raw: string | undefined): "active" | "deleted" | "all" => {
  if (raw === "deleted" || raw === "all") return raw;
  return "active";
};

export const parseAdminUsersParams = (
  raw: Record<string, string | string[] | undefined>,
): TAdminUsersListParams => {
  const str = (key: string): string | undefined => {
    const v = raw[key];
    return Array.isArray(v) ? v[0] : v;
  };

  const page = parseIntGte1(str("page"), 1);
  const rawSize = str("pageSize");
  const parsedSize = rawSize !== undefined ? parseInt(rawSize, 10) : NaN;
  const pageSize =
    Number.isFinite(parsedSize) && parsedSize >= 1
      ? Math.min(parsedSize, PAGE_SIZE_MAX)
      : PAGE_SIZE_DEFAULT;

  const params: TAdminUsersListParams = {
    page,
    pageSize,
    sortBy: parseSortBy(str("sortBy")),
    sortOrder: parseSortOrder(str("sortOrder")),
    status: parseStatus(str("status")),
  };

  const role = parseRole(str("systemRole"));
  if (role !== undefined) params.role = role;

  return params;
};

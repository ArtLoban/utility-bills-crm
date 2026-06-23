import { PROPERTY_TYPE_LIST } from "@/lib/db/schema/properties";
import type { TPropertyType } from "@/lib/db/schema/properties";

import {
  ADMIN_PROPERTIES_FILTERS,
  ADMIN_PROPERTIES_SORT_COLUMNS,
  ADMIN_PROPERTY_STATUS_FILTERS,
} from "./types";
import type {
  TAdminPropertiesListParams,
  TAdminPropertiesSortColumn,
  TAdminPropertyStatusFilter,
} from "./types";

const PAGE_SIZE_MAX = 100;
const PAGE_SIZE_DEFAULT = 25;

const parseIntGte1 = (raw: string | undefined, fallback: number): number => {
  const n = raw !== undefined ? parseInt(raw, 10) : NaN;
  return Number.isFinite(n) && n >= 1 ? n : fallback;
};

const parseSortBy = (raw: string | undefined): TAdminPropertiesSortColumn => {
  const cols: readonly string[] = ADMIN_PROPERTIES_SORT_COLUMNS;
  return cols.includes(raw ?? "") ? (raw as TAdminPropertiesSortColumn) : "createdAt";
};

const parseSortOrder = (raw: string | undefined): "asc" | "desc" =>
  raw === "asc" ? "asc" : "desc";

const parseStatus = (raw: string | undefined): TAdminPropertyStatusFilter => {
  if (raw === ADMIN_PROPERTY_STATUS_FILTERS.DELETED || raw === ADMIN_PROPERTY_STATUS_FILTERS.ALL) {
    return raw;
  }
  return ADMIN_PROPERTY_STATUS_FILTERS.ACTIVE;
};

const parseType = (raw: string | undefined): TPropertyType | undefined => {
  const types: readonly string[] = PROPERTY_TYPE_LIST;
  if (types.includes(raw ?? "")) return raw as TPropertyType;
  return undefined;
};

export const parseAdminPropertiesParams = (
  raw: Record<string, string | string[] | undefined>,
): TAdminPropertiesListParams => {
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

  const params: TAdminPropertiesListParams = {
    page,
    pageSize,
    sortBy: parseSortBy(str("sortBy")),
    sortOrder: parseSortOrder(str("sortOrder")),
    status: parseStatus(str(ADMIN_PROPERTIES_FILTERS.STATUS)),
  };

  const ownerRaw = str(ADMIN_PROPERTIES_FILTERS.OWNER);
  if (ownerRaw && ownerRaw.length > 0) params.owner = ownerRaw;

  const type = parseType(str(ADMIN_PROPERTIES_FILTERS.TYPE));
  if (type !== undefined) params.type = type;

  return params;
};

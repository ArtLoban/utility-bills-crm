import { PROPERTY_TYPE_LIST } from "@/lib/db/schema/properties";
import type { TPropertyType } from "@/lib/db/schema/properties";

import { ADMIN_PROPERTIES_SORT_COLUMNS } from "./types";
import type { TAdminPropertiesListParams, TAdminPropertiesSortColumn } from "./types";

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

const parseStatus = (raw: string | undefined): "active" | "deleted" | "all" => {
  if (raw === "deleted" || raw === "all") return raw;
  return "active";
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
    status: parseStatus(str("status")),
  };

  const ownerRaw = str("owner");
  if (ownerRaw && ownerRaw.length > 0) params.owner = ownerRaw;

  const type = parseType(str("type"));
  if (type !== undefined) params.type = type;

  return params;
};

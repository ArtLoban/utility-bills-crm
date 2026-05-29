import { PAYMENTS_SORT_COLUMNS } from "./types";
import type { TPaymentsListParams, TPaymentSortColumn } from "./types";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const PAGE_SIZE_MAX = 100;
const PAGE_SIZE_DEFAULT = 25;
const SORT_ORDER_DEFAULT = "desc" as const;

const parseIntGte1 = (raw: string | undefined, fallback: number): number => {
  const n = raw !== undefined ? parseInt(raw, 10) : NaN;
  return Number.isFinite(n) && n >= 1 ? n : fallback;
};

const parseSortBy = (raw: string | undefined): TPaymentSortColumn => {
  const cols: readonly string[] = PAYMENTS_SORT_COLUMNS;
  return cols.includes(raw ?? "") ? (raw as TPaymentSortColumn) : "paidAt";
};

const parseSortOrder = (raw: string | undefined): "asc" | "desc" =>
  raw === "asc" ? "asc" : SORT_ORDER_DEFAULT;

const parseDate = (raw: string | undefined): string | undefined =>
  raw && DATE_RE.test(raw) ? raw : undefined;

const parseServices = (raw: string | undefined): string[] | undefined => {
  if (!raw) return undefined;
  const parts = raw.split(";").filter(Boolean);
  return parts.length > 0 ? parts : undefined;
};

// Normalises raw URL search params into a validated TPaymentsListParams.
// All invalid values are silently replaced with their defaults.
export const parsePaymentsParams = (
  raw: Record<string, string | string[] | undefined>,
): TPaymentsListParams => {
  const str = (key: string): string | undefined => {
    const v = raw[key];
    if (Array.isArray(v)) return v[0];
    return v;
  };

  const page = parseIntGte1(str("page"), 1);
  const rawSize = str("pageSize") !== undefined ? parseInt(str("pageSize")!, 10) : NaN;
  const pageSize =
    Number.isFinite(rawSize) && rawSize >= 1 ? Math.min(rawSize, PAGE_SIZE_MAX) : PAGE_SIZE_DEFAULT;

  const result: TPaymentsListParams = {
    page,
    pageSize,
    sortBy: parseSortBy(str("sortBy")),
    sortOrder: parseSortOrder(str("sortOrder")),
  };

  const propertyId = str("propertyId");
  if (propertyId) result.propertyId = propertyId;

  const services = parseServices(str("service"));
  if (services) result.services = services;

  const dateFrom = parseDate(str("dateFrom"));
  if (dateFrom) result.dateFrom = dateFrom;

  const dateTo = parseDate(str("dateTo"));
  if (dateTo) result.dateTo = dateTo;

  return result;
};

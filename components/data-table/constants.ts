import { SORT_ORDER } from "@/components/data-table/types";

export const ELLIPSIS = "ellipsis" as const;

export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100] as const;
// TODO: Remove
export const FIRST_PAGE_INDEX_DEFAULT = 1;
export const DEFAULT_PAGE_SIZE = 25;

export const PAGE_DEFAULT = 1;
export const PAGE_SIZE_DEFAULT = 25;
export const PAGE_SIZE_MAX = 100;

export const DEFAULT_SORT_ORDER = SORT_ORDER.DESC;

export const DEFAULT_URL_KEYS = {
  page: "page",
  pageSize: "pageSize",
  sort: "sort",
} as const;

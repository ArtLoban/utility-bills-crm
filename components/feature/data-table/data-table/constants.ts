export const ELLIPSIS = "ellipsis" as const;

export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100] as const;
export const FIRST_PAGE_INDEX_DEFAULT = 1;
export const DEFAULT_PAGE_SIZE = 25;

export const DEFAULT_URL_KEYS = {
  page: "page",
  pageSize: "pageSize",
  sort: "sort",
} as const;

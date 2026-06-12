import { SortingState, Updater } from "@tanstack/react-table";

export const DATA_TABLE_PARAMS = {
  PAGE: "page",
  PAGE_SIZE: "pageSize",
  SORT_BY: "sortBy",
  SORT_ORDER: "sortOrder",
} as const;

export type TDataTableParam = (typeof DATA_TABLE_PARAMS)[keyof typeof DATA_TABLE_PARAMS];

export const SORT_ORDER = {
  ASC: "asc",
  DESC: "desc",
} as const;

export type TSortOrder = (typeof SORT_ORDER)[keyof typeof SORT_ORDER];

export const EMPTY_STATE_KINDS = {
  EMPTY: "empty",
  NO_RESULTS: "noResults",
} as const;

export type TEmptyStateKind = (typeof EMPTY_STATE_KINDS)[keyof typeof EMPTY_STATE_KINDS];

export type TDefaultSorting = {
  [DATA_TABLE_PARAMS.SORT_BY]: string;
  [DATA_TABLE_PARAMS.SORT_ORDER]?: TSortOrder;
};

export type TDataTableParams = {
  [DATA_TABLE_PARAMS.PAGE]: number;
  [DATA_TABLE_PARAMS.PAGE_SIZE]: number;
  [DATA_TABLE_PARAMS.SORT_BY]: string;
  [DATA_TABLE_PARAMS.SORT_ORDER]: TSortOrder;
};

export type TListParams = {
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  sorting: SortingState;
  onSortingChange: (updater: Updater<SortingState>) => void;
};

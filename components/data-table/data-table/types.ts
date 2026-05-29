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

import { parseAsString } from "nuqs";

export const DataTableField = {
  PAGE: "page",
  PAGE_SIZE: "pageSize",
  SORT_BY: "sortBy",
  SORT_ORDER: "sortOrder",
} as const;

export type TDataTableField = (typeof DataTableField)[keyof typeof DataTableField];

export const SortOrder = {
  ASC: "asc",
  DESC: "desc",
} as const;

export type TSortOrder = (typeof SortOrder)[keyof typeof SortOrder];

export type TDefaultSorting = {
  [DataTableField.SORT_BY]: string;
  [DataTableField.SORT_ORDER]?: TSortOrder;
};

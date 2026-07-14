import { METERS_SORT_COLUMNS } from "@/features/meters/types";
import type { TMeterSortColumn } from "@/features/meters/types";

export type TSortField = {
  readonly id: TMeterSortColumn;
  readonly defaultDesc: boolean;
};

export const SORT_FIELDS = [
  { id: METERS_SORT_COLUMNS.PROPERTY, defaultDesc: false },
  { id: METERS_SORT_COLUMNS.SERVICE, defaultDesc: false },
  { id: METERS_SORT_COLUMNS.INSTALLED, defaultDesc: true },
] as const satisfies readonly TSortField[];

export type TMobileSortColumn = (typeof SORT_FIELDS)[number]["id"];

export const DEFAULT_SORT_ID: TMobileSortColumn = METERS_SORT_COLUMNS.PROPERTY;
export const DEFAULT_SORT_DESC = false;

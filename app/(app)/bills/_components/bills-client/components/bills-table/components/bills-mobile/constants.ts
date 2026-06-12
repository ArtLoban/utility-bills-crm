import { BILLS_SORT_COLUMNS } from "@/features/bills";
import type { TBillSortColumn } from "@/features/bills";

export type TSortField = {
  readonly id: TBillSortColumn;
  readonly defaultDesc: boolean;
};

// `satisfies` (not a plain annotation) so the literal `id`s survive — the i18n
// keys (`bills.list.sort.<id>.*`) and TMobileSortColumn are derived from them.
export const SORT_FIELDS = [
  { id: BILLS_SORT_COLUMNS.PERIOD_MONTH, defaultDesc: true },
  { id: BILLS_SORT_COLUMNS.PROPERTY, defaultDesc: false },
  { id: BILLS_SORT_COLUMNS.SERVICE, defaultDesc: false },
  { id: BILLS_SORT_COLUMNS.AMOUNT, defaultDesc: true },
] as const satisfies readonly TSortField[];

export type TMobileSortColumn = (typeof SORT_FIELDS)[number]["id"];

export const DEFAULT_SORT_ID: TMobileSortColumn = BILLS_SORT_COLUMNS.PERIOD_MONTH;
export const DEFAULT_SORT_DESC = true;

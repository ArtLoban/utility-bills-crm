import { PAYMENT_SORT_COLUMNS } from "@/features/payments";
import type { TPaymentSortColumn } from "@/features/payments";

export type TSortField = {
  readonly id: TPaymentSortColumn;
  readonly defaultDesc: boolean;
};

// `satisfies` (not a plain annotation) so the literal `id`s survive — the i18n
// keys (`payments.list.sort.<id>.*`) and TMobileSortColumn are derived from them.
export const SORT_FIELDS = [
  { id: PAYMENT_SORT_COLUMNS.PAID_AT, defaultDesc: true },
  { id: PAYMENT_SORT_COLUMNS.PROPERTY, defaultDesc: false },
  { id: PAYMENT_SORT_COLUMNS.SERVICE, defaultDesc: false },
  { id: PAYMENT_SORT_COLUMNS.AMOUNT, defaultDesc: true },
] as const satisfies readonly TSortField[];

export type TMobileSortColumn = (typeof SORT_FIELDS)[number]["id"];

export const DEFAULT_SORT_ID: TMobileSortColumn = PAYMENT_SORT_COLUMNS.PAID_AT;
export const DEFAULT_SORT_DESC = true;

import { BILLS_SORT_COLUMNS } from "@/features/bills";
import type { TBillSortColumn } from "@/features/bills";

export type TSortField = {
  readonly id: TBillSortColumn;
  readonly label: string;
  readonly defaultDesc: boolean;
  readonly descLabel: string;
  readonly ascLabel: string;
  readonly triggerDesc: string;
  readonly triggerAsc: string;
};

export const SORT_FIELDS: readonly TSortField[] = [
  {
    id: BILLS_SORT_COLUMNS.PERIOD_MONTH,
    label: "Date",
    defaultDesc: true,
    descLabel: "Newest first",
    ascLabel: "Oldest first",
    triggerDesc: "Date (newest)",
    triggerAsc: "Date (oldest)",
  },
  {
    id: BILLS_SORT_COLUMNS.PROPERTY,
    label: "Property",
    defaultDesc: false,
    descLabel: "Z → A",
    ascLabel: "A → Z",
    triggerDesc: "Property Z–A",
    triggerAsc: "Property A–Z",
  },
  {
    id: BILLS_SORT_COLUMNS.SERVICE,
    label: "Service",
    defaultDesc: false,
    descLabel: "Z → A",
    ascLabel: "A → Z",
    triggerDesc: "Service Z–A",
    triggerAsc: "Service A–Z",
  },
  {
    id: BILLS_SORT_COLUMNS.AMOUNT,
    label: "Amount",
    defaultDesc: true,
    descLabel: "High → Low",
    ascLabel: "Low → High",
    triggerDesc: "Amount ↓",
    triggerAsc: "Amount ↑",
  },
] as const;

export const DEFAULT_SORT_ID = BILLS_SORT_COLUMNS.PERIOD_MONTH;
export const DEFAULT_SORT_DESC = true;

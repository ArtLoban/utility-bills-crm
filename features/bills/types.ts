// --- Sort allow-list ---

import { TDataTableParams } from "@/components/data-table/types";
import { TDateParams } from "@/lib/types/common";

export const BILLS_SORT_COLUMNS = {
  PERIOD_MONTH: "periodMonth",
  AMOUNT: "amount",
  CREATED_AT: "createdAt",
  PROPERTY: "property",
  SERVICE: "service",
} as const;

export type TBillSortColumn = (typeof BILLS_SORT_COLUMNS)[keyof typeof BILLS_SORT_COLUMNS];

// --- List query contract ---
export const BILLS_FILTERS = {
  PROPERTY_ID: "propertyId",
  SERVICES: "services",
} as const;

export type TBillsListParams = TDataTableParams &
  TDateParams & {
    [BILLS_FILTERS.PROPERTY_ID]?: string | null;
    [BILLS_FILTERS.SERVICES]?: string[] | null;
  };

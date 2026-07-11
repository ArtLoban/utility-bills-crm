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
// SERVICES filters by service *type* code (the filter bar). SERVICE_ID is a URL-only
// drill-down target (a single specific service, e.g. a custom `other` series on the
// dashboard) with no filter-bar control of its own.
export const BILLS_FILTERS = {
  PROPERTY_ID: "propertyId",
  SERVICES: "services",
  SERVICE_ID: "serviceId",
  PERIOD_FROM: "periodFrom",
  PERIOD_TO: "periodTo",
} as const;

export type TBillsListParams = TDataTableParams &
  TDateParams & {
    [BILLS_FILTERS.PROPERTY_ID]?: string | null;
    [BILLS_FILTERS.SERVICES]?: string[] | null;
    [BILLS_FILTERS.SERVICE_ID]?: string | null;
    [BILLS_FILTERS.PERIOD_FROM]?: string | null;
    [BILLS_FILTERS.PERIOD_TO]?: string | null;
  };

// --- Bill form fields ---
export const BillFormField = {
  PROPERTY: "property",
  SERVICE_ID: "serviceId",
  MONTH: "month",
  AMOUNT: "amount",
  NOTES: "notes",
} as const;

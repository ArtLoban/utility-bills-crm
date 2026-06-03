import { createLoader, parseAsString, parseAsStringLiteral } from "nuqs/server";

import { baseListSearchParams, parseAsSemicolonArray } from "@/lib/utils/query-parsers";
import { BILLS_SORT_COLUMNS, TBillSortColumn } from "./types";

export const billsSearchParams = {
  ...baseListSearchParams,
  sortBy: parseAsStringLiteral(Object.values(BILLS_SORT_COLUMNS) as TBillSortColumn[]).withDefault(
    BILLS_SORT_COLUMNS.PERIOD_MONTH,
  ),
  propertyId: parseAsString,
  service: parseAsSemicolonArray,
};

export const loadBillsParams = createLoader(billsSearchParams);

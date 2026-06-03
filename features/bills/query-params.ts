import { createLoader, parseAsString, parseAsStringLiteral } from "nuqs/server";

import { baseListSearchParams, parseAsSemicolonArray } from "@/lib/utils/query-parsers";
import { BILLS_SORT_COLUMNS } from "./types";

export const billsSearchParams = {
  ...baseListSearchParams,
  sortBy: parseAsStringLiteral(BILLS_SORT_COLUMNS).withDefault("periodMonth"),
  propertyId: parseAsString,
  service: parseAsSemicolonArray,
};

export const loadBillsParams = createLoader(billsSearchParams);

import { createLoader, parseAsString, parseAsStringLiteral } from "nuqs/server";

import { baseListSearchParams, parseAsSemicolonArray } from "@/lib/utils/query-parsers";
import { PAYMENTS_SORT_COLUMNS } from "./types";

export const paymentsSearchParams = {
  ...baseListSearchParams,
  sortBy: parseAsStringLiteral(PAYMENTS_SORT_COLUMNS).withDefault("paidAt"),
  propertyId: parseAsString,
  services: parseAsSemicolonArray,
};

export const loadPaymentsParams = createLoader(paymentsSearchParams);

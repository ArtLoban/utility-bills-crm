import { createLoader, parseAsString, parseAsStringLiteral } from "nuqs/server";

import { baseListSearchParams, parseAsSemicolonArray } from "@/lib/utils/query-parsers";
import { PAYMENT_SORT_COLUMNS, TPaymentSortColumn } from "./types";

export const paymentsSearchParams = {
  ...baseListSearchParams,
  sortBy: parseAsStringLiteral(
    Object.values(PAYMENT_SORT_COLUMNS) as TPaymentSortColumn[],
  ).withDefault(PAYMENT_SORT_COLUMNS.PAID_AT),
  propertyId: parseAsString,
  services: parseAsSemicolonArray,
};

export const loadPaymentsParams = createLoader(paymentsSearchParams);

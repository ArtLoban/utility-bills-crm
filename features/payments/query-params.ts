import { createLoader, parseAsString, parseAsStringLiteral } from "nuqs/server";

import { baseListSearchParams, parseAsSemicolonArray } from "@/lib/utils/query-parsers";
import { PAYMENT_SORT_COLUMNS, PAYMENTS_FILTERS, TPaymentSortColumn } from "./types";
import { DATA_TABLE_PARAMS } from "@/components/data-table/types";

export const paymentsSearchParams = {
  ...baseListSearchParams,
  [DATA_TABLE_PARAMS.SORT_BY]: parseAsStringLiteral(
    Object.values(PAYMENT_SORT_COLUMNS) as TPaymentSortColumn[],
  ).withDefault(PAYMENT_SORT_COLUMNS.PAID_AT),
  [PAYMENTS_FILTERS.PROPERTY_ID]: parseAsString,
  [PAYMENTS_FILTERS.SERVICES]: parseAsSemicolonArray,
};

export const loadPaymentsParams = createLoader(paymentsSearchParams);

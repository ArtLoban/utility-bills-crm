import { createLoader, parseAsStringLiteral } from "nuqs/server";

import { baseListSearchParams, dateRangeSearchParams } from "@/lib/utils/query-parsers";
import { READINGS_SORT_COLUMNS } from "./types";

export const readingsSearchParams = {
  ...baseListSearchParams,
  ...dateRangeSearchParams,
  sortBy: parseAsStringLiteral(Object.values(READINGS_SORT_COLUMNS)).withDefault(
    READINGS_SORT_COLUMNS.READ_AT,
  ),
};

export const loadReadingsParams = createLoader(readingsSearchParams);

import { createLoader, parseAsString, parseAsStringLiteral } from "nuqs/server";

import { baseListSearchParams, parseAsSemicolonArray } from "@/lib/utils/query-parsers";
import { SORT_ORDER, DATA_TABLE_PARAMS } from "@/components/data-table/types";
import {
  METERS_FILTERS,
  METERS_SORT_COLUMNS,
  METER_STATUSES,
  TMeterSortColumn,
  TMeterStatus,
} from "./types";

export const metersSearchParams = {
  ...baseListSearchParams,
  [DATA_TABLE_PARAMS.SORT_ORDER]: parseAsStringLiteral(Object.values(SORT_ORDER)).withDefault(
    SORT_ORDER.ASC,
  ),
  [DATA_TABLE_PARAMS.SORT_BY]: parseAsStringLiteral(
    Object.values(METERS_SORT_COLUMNS) as TMeterSortColumn[],
  ).withDefault(METERS_SORT_COLUMNS.PROPERTY),
  [METERS_FILTERS.PROPERTY_ID]: parseAsString,
  [METERS_FILTERS.SERVICES]: parseAsSemicolonArray,
  [METERS_FILTERS.STATUS]: parseAsStringLiteral(
    Object.values(METER_STATUSES) as TMeterStatus[],
  ).withDefault(METER_STATUSES.ACTIVE),
};

export const loadMetersParams = createLoader(metersSearchParams);

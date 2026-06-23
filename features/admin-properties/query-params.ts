import { createLoader, parseAsString, parseAsStringLiteral } from "nuqs/server";

import { baseListSearchParams } from "@/lib/utils/query-parsers";
import { DATA_TABLE_PARAMS } from "@/components/data-table/types";
import { PROPERTY_TYPE_LIST } from "@/lib/db/schema/properties";

import {
  ADMIN_PROPERTIES_FILTERS,
  ADMIN_PROPERTY_SORT_COLUMNS,
  ADMIN_PROPERTY_STATUS_FILTERS,
} from "./types";

export const adminPropertiesSearchParams = {
  ...baseListSearchParams,
  [DATA_TABLE_PARAMS.SORT_BY]: parseAsStringLiteral(
    Object.values(ADMIN_PROPERTY_SORT_COLUMNS),
  ).withDefault(ADMIN_PROPERTY_SORT_COLUMNS.CREATED_AT),
  [ADMIN_PROPERTIES_FILTERS.STATUS]: parseAsStringLiteral(
    Object.values(ADMIN_PROPERTY_STATUS_FILTERS),
  ).withDefault(ADMIN_PROPERTY_STATUS_FILTERS.ACTIVE),
  [ADMIN_PROPERTIES_FILTERS.TYPE]: parseAsStringLiteral(PROPERTY_TYPE_LIST),
  [ADMIN_PROPERTIES_FILTERS.OWNER]: parseAsString,
};

export const loadAdminPropertiesParams = createLoader(adminPropertiesSearchParams);

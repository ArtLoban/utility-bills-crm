import { createLoader, parseAsStringLiteral } from "nuqs/server";

import { baseListSearchParams } from "@/lib/utils/query-parsers";
import { DATA_TABLE_PARAMS } from "@/components/data-table/types";
import { SYSTEM_ROLES } from "@/lib/auth/constants";

import { ADMIN_USER_SORT_COLUMNS, ADMIN_USER_STATUS_FILTERS, ADMIN_USERS_FILTERS } from "./types";

export const adminUsersSearchParams = {
  ...baseListSearchParams,
  [DATA_TABLE_PARAMS.SORT_BY]: parseAsStringLiteral(
    Object.values(ADMIN_USER_SORT_COLUMNS),
  ).withDefault(ADMIN_USER_SORT_COLUMNS.CREATED_AT),
  [ADMIN_USERS_FILTERS.ROLE]: parseAsStringLiteral(Object.values(SYSTEM_ROLES)),
  [ADMIN_USERS_FILTERS.STATUS]: parseAsStringLiteral(
    Object.values(ADMIN_USER_STATUS_FILTERS),
  ).withDefault(ADMIN_USER_STATUS_FILTERS.ACTIVE),
};

export const loadAdminUsersParams = createLoader(adminUsersSearchParams);

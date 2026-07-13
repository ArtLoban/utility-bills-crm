"use client";

import { useServerListParams } from "@/components/data-table/server-table-group/hooks/use-server-list-params";
import { DATA_TABLE_PARAMS, SORT_ORDER } from "@/components/data-table/types";
import { ADMIN_USER_SORT_COLUMNS, type TAdminUserRow } from "@/features/admin-users/types";
import { useQueryFilters } from "@/lib/hooks/use-query-filters";
import type { TServerPagination } from "@/lib/types/data-table";

import { INITIAL_FILTERS, URL_FIELDS } from "./constants";
import type { TFiltersFormValues } from "./types";
import { UsersDesktop } from "./components/users-desktop";
import { UsersMobile } from "./components/users-mobile";

type TProps = {
  data: TAdminUserRow[];
  pagination: TServerPagination;
};

export const UsersTable = ({ data, pagination }: TProps) => {
  const listParams = useServerListParams({
    [DATA_TABLE_PARAMS.SORT_BY]: ADMIN_USER_SORT_COLUMNS.CREATED_AT,
    [DATA_TABLE_PARAMS.SORT_ORDER]: SORT_ORDER.DESC,
  });
  const queryFilters = useQueryFilters<TFiltersFormValues>(URL_FIELDS, INITIAL_FILTERS);

  return (
    <div>
      <div className="hidden md:block">
        <UsersDesktop
          data={data}
          pagination={pagination}
          listParams={listParams}
          queryFilters={queryFilters}
        />
      </div>
      <div className="-mx-8 md:hidden">
        <UsersMobile
          data={data}
          pagination={pagination}
          listParams={listParams}
          queryFilters={queryFilters}
        />
      </div>
    </div>
  );
};

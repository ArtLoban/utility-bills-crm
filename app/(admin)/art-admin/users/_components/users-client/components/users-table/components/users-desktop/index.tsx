"use client";

import { ServerTableGroup } from "@/components/data-table/server-table-group";
import type { TListParams } from "@/components/data-table/types";
import type { TAdminUserRow } from "@/features/admin-users/types";
import type { TServerPagination } from "@/lib/types/data-table";

import type { TQueryFilters } from "../../types";
import { FilterBar } from "./components/filter-bar";
import { FooterMeta } from "./components/footer-meta";
import { getUserColumns } from "./utils/get-table-columns";

type TProps = {
  data: TAdminUserRow[];
  pagination: TServerPagination;
  listParams: TListParams;
  queryFilters: TQueryFilters;
};

export const UsersDesktop = ({ data, pagination, listParams, queryFilters }: TProps) => {
  const columns = getUserColumns();

  return (
    <div>
      <FilterBar
        form={queryFilters.form}
        hasActiveFilters={queryFilters.hasActiveFilters}
        onClear={queryFilters.handleClear}
      />
      <ServerTableGroup
        data={data}
        columns={columns}
        pagination={pagination}
        listParams={listParams}
        footerMeta={<FooterMeta total={pagination.total} />}
        hasActiveFilters={queryFilters.hasActiveFilters}
      />
    </div>
  );
};

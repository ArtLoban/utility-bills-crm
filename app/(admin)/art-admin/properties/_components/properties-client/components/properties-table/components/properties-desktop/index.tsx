"use client";

import { ServerTableGroup } from "@/components/data-table/server-table-group";
import type { TListParams } from "@/components/data-table/types";
import type { TAdminPropertyRow } from "@/features/admin-properties/types";
import type { TServerPagination } from "@/lib/types/data-table";

import type { TOwnerFilter, TQueryFilters } from "../../types";
import { FilterBar } from "./components/filter-bar";
import { FooterMeta } from "./components/footer-meta";
import { getPropertyColumns } from "./utils/get-table-columns";

type TProps = {
  data: TAdminPropertyRow[];
  pagination: TServerPagination;
  listParams: TListParams;
  queryFilters: TQueryFilters;
  ownerFilter: TOwnerFilter;
  hasActiveFilters: boolean;
  onClear: () => void;
};

export const PropertiesDesktop = (props: TProps) => {
  const { data, pagination, listParams, queryFilters, ownerFilter, hasActiveFilters, onClear } =
    props;
  const columns = getPropertyColumns();

  return (
    <div>
      <FilterBar
        form={queryFilters.form}
        ownerFilter={ownerFilter}
        hasActiveFilters={hasActiveFilters}
        onClear={onClear}
      />
      <ServerTableGroup
        data={data}
        columns={columns}
        pagination={pagination}
        listParams={listParams}
        footerMeta={<FooterMeta total={pagination.total} />}
        hasActiveFilters={hasActiveFilters}
      />
    </div>
  );
};

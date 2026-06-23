"use client";

import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";

import { useServerListParams } from "@/components/data-table/server-table-group/hooks/use-server-list-params";
import { DATA_TABLE_PARAMS, SORT_ORDER } from "@/components/data-table/types";
import { PAGE_DEFAULT } from "@/components/data-table/constants";
import { useQueryFilters } from "@/lib/hooks/use-query-filters";
import {
  ADMIN_PROPERTIES_FILTERS,
  ADMIN_PROPERTY_SORT_COLUMNS,
  type TAdminPropertyRow,
} from "@/features/admin-properties/types";
import type { TServerPagination } from "@/lib/types/data-table";

import { INITIAL_FILTERS, URL_FIELDS } from "./constants";
import type { TFiltersFormValues, TOwnerFilter } from "./types";
import { PropertiesDesktop } from "./components/properties-desktop";
import { PropertiesMobile } from "./components/properties-mobile";

type TProps = {
  data: TAdminPropertyRow[];
  pagination: TServerPagination;
  ownerName: string | null;
};

export const PropertiesTable = ({ data, pagination, ownerName }: TProps) => {
  const listParams = useServerListParams({
    [DATA_TABLE_PARAMS.SORT_BY]: ADMIN_PROPERTY_SORT_COLUMNS.CREATED_AT,
    [DATA_TABLE_PARAMS.SORT_ORDER]: SORT_ORDER.DESC,
  });
  const queryFilters = useQueryFilters<TFiltersFormValues>(URL_FIELDS, INITIAL_FILTERS);

  const [, setOwner] = useQueryStates(
    {
      [ADMIN_PROPERTIES_FILTERS.OWNER]: parseAsString,
      [DATA_TABLE_PARAMS.PAGE]: parseAsInteger.withDefault(PAGE_DEFAULT),
    },
    { history: "replace", shallow: false },
  );
  const ownerFilter: TOwnerFilter = {
    name: ownerName,
    clear: () =>
      void setOwner({
        [ADMIN_PROPERTIES_FILTERS.OWNER]: null,
        [DATA_TABLE_PARAMS.PAGE]: PAGE_DEFAULT,
      }),
  };

  const hasActiveFilters = queryFilters.hasActiveFilters || ownerName !== null;
  const handleClear = () => {
    queryFilters.handleClear();
    ownerFilter.clear();
  };

  return (
    <div>
      <div className="hidden md:block">
        <PropertiesDesktop
          data={data}
          pagination={pagination}
          listParams={listParams}
          queryFilters={queryFilters}
          ownerFilter={ownerFilter}
          hasActiveFilters={hasActiveFilters}
          onClear={handleClear}
        />
      </div>
      <div className="-mx-8 md:hidden">
        <PropertiesMobile
          data={data}
          pagination={pagination}
          listParams={listParams}
          queryFilters={queryFilters}
          ownerFilter={ownerFilter}
          hasActiveFilters={hasActiveFilters}
          onClear={handleClear}
        />
      </div>
    </div>
  );
};

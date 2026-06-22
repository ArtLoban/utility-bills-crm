"use client";

import { useServerListParams } from "@/components/data-table/server-table-group/hooks/use-server-list-params";
import { useQueryFilters } from "@/lib/hooks/use-query-filters";
import { SORT_ORDER } from "@/components/data-table/types";
import type { TMetersListResult } from "@/lib/db/access/meters";
import { METERS_SORT_COLUMNS } from "@/features/meters/types";
import type { TPropertyOption } from "@/features/properties";

import { URL_FIELDS, INITIAL_FILTERS } from "./constants";
import { MetersTableDesktop } from "./components/meters-table-desktop";
import { MetersTableMobile } from "./components/meters-mobile";

type TProps = {
  metersList: TMetersListResult;
  properties: TPropertyOption[];
};

export const MetersTable = ({ metersList, properties }: TProps) => {
  const listParams = useServerListParams({
    sortBy: METERS_SORT_COLUMNS.PROPERTY,
    sortOrder: SORT_ORDER.ASC,
  });
  const queryFilters = useQueryFilters(URL_FIELDS, INITIAL_FILTERS);

  return (
    <div>
      <div className="hidden md:block">
        <MetersTableDesktop
          metersList={metersList}
          listParams={listParams}
          queryFilters={queryFilters}
          properties={properties}
        />
      </div>
      <div className="md:hidden">
        <MetersTableMobile
          metersList={metersList}
          listParams={listParams}
          queryFilters={queryFilters}
          properties={properties}
        />
      </div>
    </div>
  );
};

"use client";

import { useTranslations } from "next-intl";

import { ServerTableGroup } from "@/components/data-table/server-table-group";
import type { TListParams } from "@/components/data-table/types";
import type { TReadingsListResult } from "@/lib/db/access/readings";
import type { TMeter } from "@/lib/db/schema/meters";
import type { TReading } from "@/lib/db/schema/readings";
import type { TServiceType } from "@/lib/db/schema/service-types";

import type { TQueryFilters } from "../../types";
import { FilterBar } from "./components/filter-bar";
import { getReadingsColumns } from "./utils/get-readings-columns";

type TProps = {
  readingsList: TReadingsListResult;
  listParams: TListParams;
  queryFilters: TQueryFilters;
  meter: TMeter;
  serviceType: TServiceType;
  canMutate: boolean;
};

export const ReadingsDesktop = ({
  readingsList,
  listParams,
  queryFilters,
  meter,
  serviceType,
  canMutate,
}: TProps) => {
  const { data, pagination } = readingsList;
  const { hasActiveFilters } = queryFilters;

  const t = useTranslations("meters.detail");
  const columns = getReadingsColumns(t, meter, serviceType, canMutate);

  return (
    <div>
      <FilterBar queryFilters={queryFilters} />
      <ServerTableGroup<TReading>
        data={data}
        columns={columns}
        pagination={pagination}
        listParams={listParams}
        hasActiveFilters={hasActiveFilters}
      />
    </div>
  );
};

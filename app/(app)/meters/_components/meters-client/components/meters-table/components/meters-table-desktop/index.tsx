"use client";

import { useTranslations } from "next-intl";

import { ServerTableGroup } from "@/components/data-table/server-table-group";
import { TListParams } from "@/components/data-table/types";
import type { TMetersListResult } from "@/lib/db/access/meters";
import { METER_STATUSES } from "@/features/meters/types";
import type { TPropertyOption } from "@/features/properties";

import { TQueryFilters } from "../../types";
import { getMetersColumns } from "./utils/get-table-columns";
import { FilterBar } from "./components/filter-bar";
import { FooterMeta } from "./components/footer-meta";

type TProps = {
  metersList: TMetersListResult;
  listParams: TListParams;
  queryFilters: TQueryFilters;
  properties: TPropertyOption[];
};

export const MetersTableDesktop = ({
  metersList,
  listParams,
  queryFilters,
  properties,
}: TProps) => {
  const { data, pagination, totals } = metersList;
  const { hasActiveFilters, values } = queryFilters;

  const t = useTranslations("meters.list");
  const showHistoricalBadge = values.status === METER_STATUSES.ALL;
  const columns = getMetersColumns(t, showHistoricalBadge);

  return (
    <div>
      <FilterBar queryFilters={queryFilters} properties={properties} />
      <ServerTableGroup
        data={data}
        columns={columns}
        pagination={pagination}
        listParams={listParams}
        footerMeta={
          <FooterMeta
            total={pagination.total}
            propertyCount={totals.propertyCount}
            activeCount={totals.activeCount}
          />
        }
        hasActiveFilters={hasActiveFilters}
      />
    </div>
  );
};

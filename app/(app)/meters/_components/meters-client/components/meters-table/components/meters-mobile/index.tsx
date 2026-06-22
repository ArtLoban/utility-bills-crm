"use client";

import { useTranslations } from "next-intl";

import { EmptyState } from "@/components/data-table/components/empty-state";
import { resolveEmptyKind } from "@/components/data-table/utils/resolve-empty-kind";
import { MobilePager } from "@/components/data-table/components/mobile-pager";
import type { TListParams } from "@/components/data-table/types";
import type { TMetersListResult } from "@/lib/db/access/meters";
import { METER_STATUSES } from "@/features/meters/types";
import type { TPropertyOption } from "@/features/properties";

import { TQueryFilters } from "../../types";
import { MeterCard } from "./components/meter-card";
import { FilterControls } from "./components/filter-controls";
import { SortControls } from "./components/sort-controls";
import { ActiveFilterChips } from "./components/active-filter-chips";

type TProps = {
  metersList: TMetersListResult;
  listParams: TListParams;
  queryFilters: TQueryFilters;
  properties: TPropertyOption[];
};

export const MetersTableMobile = ({ metersList, listParams, queryFilters, properties }: TProps) => {
  const { data, pagination, totals } = metersList;
  const t = useTranslations("meters.list");
  const showHistoricalBadge = queryFilters.values.status === METER_STATUSES.ALL;

  return (
    <div className="pt-2 pb-8">
      <div className="mb-3.5 flex items-center justify-between">
        <FilterControls queryFilters={queryFilters} properties={properties} />
        <SortControls listParams={listParams} />
      </div>
      <ActiveFilterChips queryFilters={queryFilters} properties={properties} />

      {data.length === 0 ? (
        <EmptyState kind={resolveEmptyKind(queryFilters.hasActiveFilters)} />
      ) : (
        <>
          <div className="flex flex-col gap-2">
            {data.map((row) => (
              <MeterCard key={row.meter.id} row={row} showHistoricalBadge={showHistoricalBadge} />
            ))}
          </div>

          <MobilePager pagination={pagination} listParams={listParams} />

          <div className="border-border text-muted-foreground mt-4 flex items-center justify-between border-t pt-3.5 text-sm">
            <span>
              {t("subtitle", { count: pagination.total, propertyCount: totals.propertyCount })}
            </span>
            <span>{t("subtitleActive", { activeCount: totals.activeCount })}</span>
          </div>
        </>
      )}
    </div>
  );
};

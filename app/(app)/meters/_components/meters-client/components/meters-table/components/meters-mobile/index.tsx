"use client";

import { useTranslations } from "next-intl";

import { EmptyState } from "@/components/data-table/components/empty-state";
import { MobilePager } from "@/components/data-table/components/mobile-pager";
import { FilterTrigger } from "@/components/data-table/mobile/filter-trigger";
import { SortControls } from "@/components/data-table/mobile/sort/sort-controls";
import { MobileToolsPanel } from "@/components/data-table/mobile/tools-panel";
import { resolveEmptyKind } from "@/components/data-table/utils/resolve-empty-kind";
import type { TListParams } from "@/components/data-table/types";
import type { TMetersListResult } from "@/lib/db/access/meters";
import { METER_STATUSES } from "@/features/meters/types";
import type { TPropertyOption } from "@/features/properties";

import type { TQueryFilters } from "../../types";
import { DEFAULT_SORT_DESC, DEFAULT_SORT_ID, SORT_FIELDS } from "./constants";
import { ActiveFilterChips } from "./components/active-filter-chips";
import { FilterFields } from "./components/filter-fields";
import { MeterCard } from "./components/meter-card";

type TProps = {
  metersList: TMetersListResult;
  listParams: TListParams;
  queryFilters: TQueryFilters;
  properties: TPropertyOption[];
};

export const MetersTableMobile = ({ metersList, listParams, queryFilters, properties }: TProps) => {
  const { data, pagination, totals } = metersList;
  const { values, hasActiveFilters, handleClear } = queryFilters;
  const t = useTranslations("meters.list");
  const showHistoricalBadge = values.status === METER_STATUSES.ALL;

  const activeCount = [
    values.propertyId != null,
    values.services != null,
    values.status != null && values.status !== METER_STATUSES.ACTIVE,
  ].filter(Boolean).length;

  return (
    <div className="pt-2 pb-8">
      <MobileToolsPanel
        filter={
          <FilterTrigger
            label={t("filters.label")}
            title={t("filters.label")}
            clearLabel={t("filters.clear")}
            activeCount={activeCount}
            onClear={handleClear}
          >
            <FilterFields queryFilters={queryFilters} properties={properties} />
          </FilterTrigger>
        }
        sort={
          <SortControls
            listParams={listParams}
            sortFields={SORT_FIELDS}
            defaultSort={{ id: DEFAULT_SORT_ID, desc: DEFAULT_SORT_DESC }}
            title={t("sort.title")}
            getTriggerLabel={(id, desc) => t(`sort.${id}.${desc ? "triggerDesc" : "triggerAsc"}`)}
            getOptionLabel={(id) => t(`sort.${id}.label`)}
            getDirLabel={(id, desc) => t(`sort.${id}.${desc ? "desc" : "asc"}`)}
          />
        }
        chips={<ActiveFilterChips queryFilters={queryFilters} properties={properties} />}
      />

      {data.length === 0 ? (
        <EmptyState kind={resolveEmptyKind(hasActiveFilters)} />
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

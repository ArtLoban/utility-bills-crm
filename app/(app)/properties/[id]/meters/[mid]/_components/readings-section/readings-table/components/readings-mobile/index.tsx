"use client";

import { useTranslations } from "next-intl";

import { EmptyState } from "@/components/data-table/components/empty-state";
import { MobilePager } from "@/components/data-table/components/mobile-pager";
import { FilterTrigger } from "@/components/data-table/mobile/filter-trigger";
import { SortControls } from "@/components/data-table/mobile/sort/sort-controls";
import { MobileToolsPanel } from "@/components/data-table/mobile/tools-panel";
import { resolveEmptyKind } from "@/components/data-table/utils/resolve-empty-kind";
import type { TListParams } from "@/components/data-table/types";
import type { TReadingsListResult } from "@/lib/db/access/readings";
import type { TMeter } from "@/lib/db/schema/meters";
import type { TServiceType } from "@/lib/db/schema/service-types";

import { DEFAULT_SORT, SORT_FIELDS } from "../../constants";
import type { TQueryFilters } from "../../types";
import { ActiveFilterChips } from "./components/active-filter-chips";
import { FilterFields } from "./components/filter-fields";
import { ReadingCard } from "./components/reading-card";

type TProps = {
  readingsList: TReadingsListResult;
  listParams: TListParams;
  queryFilters: TQueryFilters;
  meter: TMeter;
  serviceType: TServiceType;
  canMutate: boolean;
};

export const ReadingsMobile = ({
  readingsList,
  listParams,
  queryFilters,
  meter,
  serviceType,
  canMutate,
}: TProps) => {
  const { data, pagination } = readingsList;
  const { hasActiveFilters, handleClear, values } = queryFilters;
  const t = useTranslations("meters.detail.readings");

  const activeCount = values.dateFrom != null || values.dateTo != null ? 1 : 0;

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
            <FilterFields queryFilters={queryFilters} />
          </FilterTrigger>
        }
        sort={
          <SortControls
            listParams={listParams}
            sortFields={SORT_FIELDS}
            defaultSort={DEFAULT_SORT}
            title={t("sort.title")}
            getTriggerLabel={(_id, desc) => t(`sort.readAt.${desc ? "triggerDesc" : "triggerAsc"}`)}
            getOptionLabel={() => t("sort.readAt.label")}
            getDirLabel={(_id, desc) => t(`sort.readAt.${desc ? "desc" : "asc"}`)}
          />
        }
        chips={<ActiveFilterChips queryFilters={queryFilters} />}
      />

      {data.length === 0 ? (
        <EmptyState kind={resolveEmptyKind(hasActiveFilters)} />
      ) : (
        <>
          <div className="flex flex-col gap-2">
            {data.map((reading) => (
              <ReadingCard
                key={reading.id}
                reading={reading}
                meter={meter}
                serviceType={serviceType}
                canMutate={canMutate}
              />
            ))}
          </div>

          <MobilePager pagination={pagination} listParams={listParams} />
        </>
      )}
    </div>
  );
};

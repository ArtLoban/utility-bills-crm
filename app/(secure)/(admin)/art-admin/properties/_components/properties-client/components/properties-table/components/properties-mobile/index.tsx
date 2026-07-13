"use client";

import { EmptyState } from "@/components/data-table/components/empty-state";
import { resolveEmptyKind } from "@/components/data-table/utils/resolve-empty-kind";
import { MobilePager } from "@/components/data-table/components/mobile-pager";
import type { TListParams } from "@/components/data-table/types";
import type { TAdminPropertyRow } from "@/features/admin-properties/types";
import type { TServerPagination } from "@/lib/types/data-table";

import { formatPropertyCount } from "../../utils/format-property-count";
import type { TOwnerFilter, TQueryFilters } from "../../types";
import { PropertyCard } from "./components/property-card";
import { FilterControls } from "./components/filter-controls";
import { SortControls } from "./components/sort-controls";
import { ActiveFilterChips } from "./components/active-filter-chips";

type TProps = {
  data: TAdminPropertyRow[];
  pagination: TServerPagination;
  listParams: TListParams;
  queryFilters: TQueryFilters;
  ownerFilter: TOwnerFilter;
  hasActiveFilters: boolean;
  onClear: () => void;
};

export const PropertiesMobile = (props: TProps) => {
  const { data, pagination, listParams, queryFilters, ownerFilter, hasActiveFilters, onClear } =
    props;

  return (
    <div className="pt-2 pb-8">
      <div className="mb-3.5 flex items-center justify-between">
        <FilterControls queryFilters={queryFilters} ownerFilter={ownerFilter} onClear={onClear} />
        <SortControls listParams={listParams} />
      </div>
      <ActiveFilterChips
        queryFilters={queryFilters}
        ownerFilter={ownerFilter}
        hasActiveFilters={hasActiveFilters}
      />

      {data.length === 0 ? (
        <EmptyState kind={resolveEmptyKind(hasActiveFilters)} />
      ) : (
        <>
          <div className="flex flex-col gap-2">
            {data.map((row) => (
              <PropertyCard key={row.id} row={row} />
            ))}
          </div>

          <MobilePager pagination={pagination} listParams={listParams} />

          <div className="border-border text-muted-foreground mt-4 flex items-center border-t pt-3.5 text-sm">
            <span>{formatPropertyCount(pagination.total)}</span>
          </div>
        </>
      )}
    </div>
  );
};

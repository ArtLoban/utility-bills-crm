"use client";

import { EmptyState } from "@/components/data-table/components/empty-state";
import { resolveEmptyKind } from "@/components/data-table/utils/resolve-empty-kind";
import { MobilePager } from "@/components/data-table/components/mobile-pager";
import type { TListParams } from "@/components/data-table/types";
import type { TAdminUserRow } from "@/features/admin-users/types";
import type { TServerPagination } from "@/lib/types/data-table";

import { formatUserCount } from "../../utils/format-user-count";
import type { TQueryFilters } from "../../types";
import { UserCard } from "./components/user-card";
import { FilterControls } from "./components/filter-controls";
import { SortControls } from "./components/sort-controls";
import { ActiveFilterChips } from "./components/active-filter-chips";

type TProps = {
  data: TAdminUserRow[];
  pagination: TServerPagination;
  listParams: TListParams;
  queryFilters: TQueryFilters;
};

export const UsersMobile = ({ data, pagination, listParams, queryFilters }: TProps) => {
  const { hasActiveFilters, handleClear } = queryFilters;

  return (
    <div className="pt-2 pb-8">
      <div className="mb-3.5 flex items-center justify-between">
        <FilterControls queryFilters={queryFilters} onClear={handleClear} />
        <SortControls listParams={listParams} />
      </div>
      <ActiveFilterChips queryFilters={queryFilters} hasActiveFilters={hasActiveFilters} />

      {data.length === 0 ? (
        <EmptyState kind={resolveEmptyKind(hasActiveFilters)} />
      ) : (
        <>
          <div className="flex flex-col gap-2">
            {data.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>

          <MobilePager pagination={pagination} listParams={listParams} />

          <div className="border-border text-muted-foreground mt-4 flex items-center border-t pt-3.5 text-sm">
            <span>{formatUserCount(pagination.total)}</span>
          </div>
        </>
      )}
    </div>
  );
};

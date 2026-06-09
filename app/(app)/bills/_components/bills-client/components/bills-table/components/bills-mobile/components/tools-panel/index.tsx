import { FilterControls } from "@/app/(app)/bills/_components/bills-client/components/bills-table/components/bills-mobile/components/tools-panel/components/filter-controls";
import { SortControls } from "@/app/(app)/bills/_components/bills-client/components/bills-table/components/bills-mobile/components/tools-panel/components/sort-controls";
import { ActiveFilterChips } from "@/app/(app)/bills/_components/bills-client/components/bills-table/components/bills-mobile/components/tools-panel/components/active-filter-chips";
import type { TQueryFilters } from "@/app/(app)/bills/_components/bills-client/components/bills-table/types";
import type { TListParams } from "@/components/data-table/types";

type TProps = {
  queryFilters: TQueryFilters;
  listParams: TListParams;
};

export const ToolsPanel = ({ queryFilters, listParams }: TProps) => (
  <div>
    <div className="mb-3.5 flex items-center justify-between">
      <FilterControls queryFilters={queryFilters} />
      <SortControls listParams={listParams} />
    </div>
    <ActiveFilterChips queryFilters={queryFilters} />
  </div>
);

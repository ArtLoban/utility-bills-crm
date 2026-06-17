import { FilterControls } from "@/app/(app)/payments/_components/payments-client/components/payments-table/components/table-mobile/components/tools-panel/components/filter-controls";
import { SortControls } from "@/app/(app)/payments/_components/payments-client/components/payments-table/components/table-mobile/components/tools-panel/components/sort-controls";
import type { TQueryFilters } from "@/app/(app)/payments/_components/payments-client/components/payments-table/types";
import type { TListParams } from "@/components/data-table/types";
import { ActiveFilterChips } from "./components/active-filter-chips";

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

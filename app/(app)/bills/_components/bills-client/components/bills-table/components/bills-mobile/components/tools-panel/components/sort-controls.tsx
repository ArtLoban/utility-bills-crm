import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SortSheet } from "@/app/(app)/bills/_components/bills-client/components/bills-table/components/bills-mobile/components/sort-sheet";
import {
  DEFAULT_SORT_DESC,
  DEFAULT_SORT_ID,
  SORT_FIELDS,
} from "@/app/(app)/bills/_components/bills-client/components/bills-table/components/bills-mobile/constants";
import type { TBillSortColumn } from "@/features/bills";
import type { TListParams } from "@/components/data-table/types";

type TProps = {
  listParams: TListParams;
};

export const SortControls = ({ listParams }: TProps) => {
  const [sheetOpen, setSheetOpen] = useState(false);
  const { sorting, onSortingChange } = listParams;

  const currentSort = sorting[0];
  const currentSortId = currentSort?.id ?? DEFAULT_SORT_ID;
  const currentDesc = currentSort?.desc ?? DEFAULT_SORT_DESC;
  const isNonDefaultSort = currentSortId !== DEFAULT_SORT_ID || currentDesc !== DEFAULT_SORT_DESC;

  const activeSortField = SORT_FIELDS.find((f) => f.id === currentSortId);
  const sortTriggerLabel = activeSortField
    ? currentDesc
      ? activeSortField.triggerDesc
      : activeSortField.triggerAsc
    : "Date (newest)";

  const handleSort = (id: TBillSortColumn, desc: boolean) => {
    onSortingChange([{ id, desc }]);
  };

  return (
    <>
      <Button
        variant={isNonDefaultSort ? "active" : "outline"}
        onClick={() => setSheetOpen(true)}
        className="font-normal"
      >
        {currentDesc ? (
          <ChevronDown size={11} strokeWidth={2} />
        ) : (
          <ChevronUp size={11} strokeWidth={2} />
        )}
        {sortTriggerLabel}
      </Button>
      <SortSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        currentSortId={currentSortId}
        currentDesc={currentDesc}
        onSort={handleSort}
      />
    </>
  );
};

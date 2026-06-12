import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SortSheet } from "@/app/(app)/bills/_components/bills-client/components/bills-table/components/bills-mobile/components/sort-sheet";
import { useSortControls } from "@/app/(app)/bills/_components/bills-client/components/bills-table/components/bills-mobile/components/tools-panel/components/sort-controls/hooks/use-sort-controls";
import type { TListParams } from "@/components/data-table/types";

type TProps = {
  listParams: TListParams;
};

export const SortControls = ({ listParams }: TProps) => {
  const {
    sheetOpen,
    setSheetOpen,
    currentSortId,
    currentDesc,
    isNonDefaultSort,
    sortTriggerLabel,
    handleSort,
  } = useSortControls(listParams);

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

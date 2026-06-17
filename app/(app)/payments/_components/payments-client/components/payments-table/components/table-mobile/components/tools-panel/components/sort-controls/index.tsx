import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SortSheet } from "@/app/(app)/payments/_components/payments-client/components/payments-table/components/table-mobile/components/sort-sheet";
import { useSortControls } from "@/app/(app)/payments/_components/payments-client/components/payments-table/components/table-mobile/components/tools-panel/components/sort-controls/hooks/use-sort-controls";
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

  const Icon = currentDesc ? ChevronDown : ChevronUp;

  return (
    <>
      <Button
        variant={isNonDefaultSort ? "activeSoft" : "outline"}
        onClick={() => setSheetOpen(true)}
        className="font-normal"
      >
        <Icon size={11} strokeWidth={2} />
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

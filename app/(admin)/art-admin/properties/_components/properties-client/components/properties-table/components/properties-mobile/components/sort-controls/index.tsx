"use client";

import { ChevronDown, ChevronUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { TListParams } from "@/components/data-table/types";

import { SortSheet } from "../sort-sheet";
import { useSortControls } from "./hooks/use-sort-controls";

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

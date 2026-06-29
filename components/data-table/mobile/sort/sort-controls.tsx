"use client";

import { ChevronDown, ChevronUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { TListParams } from "@/components/data-table/types";

import type { TMobileSortField, TResolvedSort } from "../types";
import { useSortControls } from "./use-sort-controls";
import { SortSheet, type TSortOption } from "./sort-sheet";

type TProps = {
  listParams: TListParams;
  sortFields: readonly TMobileSortField[];
  defaultSort: TResolvedSort;
  title: string;
  getTriggerLabel: (id: string, desc: boolean) => string;
  getOptionLabel: (id: string) => string;
  getDirLabel: (id: string, desc: boolean) => string;
};

export const SortControls = ({
  listParams,
  sortFields,
  defaultSort,
  title,
  getTriggerLabel,
  getOptionLabel,
  getDirLabel,
}: TProps) => {
  const { sheetOpen, setSheetOpen, currentSortId, currentDesc, isNonDefaultSort, handleSort } =
    useSortControls({ listParams, sortFields, defaultSort });

  const Icon = currentDesc ? ChevronDown : ChevronUp;

  const options: TSortOption[] = sortFields.map(({ id, defaultDesc }) => ({
    id,
    defaultDesc,
    label: getOptionLabel(id),
  }));

  return (
    <>
      <Button
        variant={isNonDefaultSort ? "activeSoft" : "outline"}
        onClick={() => setSheetOpen(true)}
        className="font-normal"
      >
        <Icon size={11} strokeWidth={2} />
        {getTriggerLabel(currentSortId, currentDesc)}
      </Button>
      <SortSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        title={title}
        options={options}
        currentSortId={currentSortId}
        currentDesc={currentDesc}
        dirLabel={getDirLabel(currentSortId, currentDesc)}
        onSort={handleSort}
      />
    </>
  );
};

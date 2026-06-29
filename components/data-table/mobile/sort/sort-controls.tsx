"use client";

import { ChevronDown, ChevronUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { TListParams } from "@/components/data-table/types";

import type { TMobileSortField, TResolvedSort } from "../types";
import { useSortControls } from "./use-sort-controls";
import { SortSheet, type TSortOption } from "./sort-sheet";

type TProps<TId extends string> = {
  listParams: TListParams;
  sortFields: readonly TMobileSortField<TId>[];
  defaultSort: TResolvedSort<TId>;
  title: string;
  getTriggerLabel: (id: TId, desc: boolean) => string;
  getOptionLabel: (id: TId) => string;
  getDirLabel: (id: TId, desc: boolean) => string;
};

export const SortControls = <TId extends string>({
  listParams,
  sortFields,
  defaultSort,
  title,
  getTriggerLabel,
  getOptionLabel,
  getDirLabel,
}: TProps<TId>) => {
  const { sheetOpen, setSheetOpen, currentSortId, currentDesc, isNonDefaultSort, handleSort } =
    useSortControls({ listParams, sortFields, defaultSort });

  const Icon = currentDesc ? ChevronDown : ChevronUp;

  const options: TSortOption<TId>[] = sortFields.map(({ id, defaultDesc }) => ({
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

"use client";

import { useState } from "react";

import type { TListParams } from "@/components/data-table/types";

import type { TMobileSortField, TResolvedSort } from "../types";
import { resolveSort } from "./resolve-sort";

type TParams<TId extends string> = {
  listParams: TListParams;
  sortFields: readonly TMobileSortField<TId>[];
  defaultSort: TResolvedSort<TId>;
};

type TResult<TId extends string> = {
  sheetOpen: boolean;
  setSheetOpen: (open: boolean) => void;
  currentSortId: TId;
  currentDesc: boolean;
  isNonDefaultSort: boolean;
  handleSort: (id: TId, desc: boolean) => void;
};

export const useSortControls = <TId extends string>({
  listParams,
  sortFields,
  defaultSort,
}: TParams<TId>): TResult<TId> => {
  const { sorting, onSortingChange } = listParams;
  const [sheetOpen, setSheetOpen] = useState(false);

  const { id: currentSortId, desc: currentDesc } = resolveSort(sorting, sortFields, defaultSort);
  const isNonDefaultSort = currentSortId !== defaultSort.id || currentDesc !== defaultSort.desc;

  const handleSort = (id: TId, desc: boolean) => onSortingChange([{ id, desc }]);

  return {
    sheetOpen,
    setSheetOpen,
    currentSortId,
    currentDesc,
    isNonDefaultSort,
    handleSort,
  };
};

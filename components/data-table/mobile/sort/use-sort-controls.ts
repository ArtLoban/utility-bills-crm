"use client";

import { useState } from "react";

import type { TListParams } from "@/components/data-table/types";

import type { TMobileSortField, TResolvedSort } from "../types";
import { resolveSort } from "./resolve-sort";

type TParams = {
  listParams: TListParams;
  sortFields: readonly TMobileSortField[];
  defaultSort: TResolvedSort;
};

type TResult = {
  sheetOpen: boolean;
  setSheetOpen: (open: boolean) => void;
  currentSortId: string;
  currentDesc: boolean;
  isNonDefaultSort: boolean;
  handleSort: (id: string, desc: boolean) => void;
};

export const useSortControls = ({ listParams, sortFields, defaultSort }: TParams): TResult => {
  const { sorting, onSortingChange } = listParams;
  const [sheetOpen, setSheetOpen] = useState(false);

  const { id: currentSortId, desc: currentDesc } = resolveSort(sorting, sortFields, defaultSort);
  const isNonDefaultSort = currentSortId !== defaultSort.id || currentDesc !== defaultSort.desc;

  const handleSort = (id: string, desc: boolean) => onSortingChange([{ id, desc }]);

  return {
    sheetOpen,
    setSheetOpen,
    currentSortId,
    currentDesc,
    isNonDefaultSort,
    handleSort,
  };
};

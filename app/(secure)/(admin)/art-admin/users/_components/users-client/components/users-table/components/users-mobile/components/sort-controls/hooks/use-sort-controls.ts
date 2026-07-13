import { useState } from "react";

import type { TListParams } from "@/components/data-table/types";

import {
  DEFAULT_SORT_DESC,
  DEFAULT_SORT_ID,
  SORT_FIELDS,
  type TMobileSortColumn,
} from "../../../constants";
import { resolveSort } from "../utils/resolve-sort";

type TUseSortControlsResult = {
  sheetOpen: boolean;
  setSheetOpen: (open: boolean) => void;
  currentSortId: TMobileSortColumn;
  currentDesc: boolean;
  isNonDefaultSort: boolean;
  sortTriggerLabel: string;
  handleSort: (id: TMobileSortColumn, desc: boolean) => void;
};

export const useSortControls = ({
  sorting,
  onSortingChange,
}: TListParams): TUseSortControlsResult => {
  const [sheetOpen, setSheetOpen] = useState(false);

  const { id: currentSortId, desc: currentDesc } = resolveSort(sorting);
  const field = SORT_FIELDS.find((f) => f.id === currentSortId) ?? SORT_FIELDS[0];
  const isNonDefaultSort = currentSortId !== DEFAULT_SORT_ID || currentDesc !== DEFAULT_SORT_DESC;
  const sortTriggerLabel = currentDesc ? field.triggerDesc : field.triggerAsc;

  const handleSort = (id: TMobileSortColumn, desc: boolean) => onSortingChange([{ id, desc }]);

  return {
    sheetOpen,
    setSheetOpen,
    currentSortId,
    currentDesc,
    isNonDefaultSort,
    sortTriggerLabel,
    handleSort,
  };
};

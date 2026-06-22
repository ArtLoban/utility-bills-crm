import { useState } from "react";
import { useTranslations } from "next-intl";

import type { TListParams } from "@/components/data-table/types";
import type { TMeterSortColumn } from "@/features/meters/types";

import { DEFAULT_SORT_DESC, DEFAULT_SORT_ID, type TMobileSortColumn } from "../../../constants";
import { resolveSort } from "../utils/resolve-sort";

type TUseSortControlsResult = {
  sheetOpen: boolean;
  setSheetOpen: (open: boolean) => void;
  currentSortId: TMobileSortColumn;
  currentDesc: boolean;
  isNonDefaultSort: boolean;
  sortTriggerLabel: string;
  handleSort: (id: TMeterSortColumn, desc: boolean) => void;
};

export const useSortControls = ({
  sorting,
  onSortingChange,
}: TListParams): TUseSortControlsResult => {
  const [sheetOpen, setSheetOpen] = useState(false);
  const t = useTranslations("meters.list.sort");

  const { id: currentSortId, desc: currentDesc } = resolveSort(sorting);
  const isNonDefaultSort = currentSortId !== DEFAULT_SORT_ID || currentDesc !== DEFAULT_SORT_DESC;
  const sortTriggerLabel = t(`${currentSortId}.${currentDesc ? "triggerDesc" : "triggerAsc"}`);

  const handleSort = (id: TMeterSortColumn, desc: boolean) => {
    onSortingChange([{ id, desc }]);
  };

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

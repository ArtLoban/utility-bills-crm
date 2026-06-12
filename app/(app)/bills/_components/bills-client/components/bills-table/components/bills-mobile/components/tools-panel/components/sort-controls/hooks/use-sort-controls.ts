import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  DEFAULT_SORT_DESC,
  DEFAULT_SORT_ID,
  type TMobileSortColumn,
} from "@/app/(app)/bills/_components/bills-client/components/bills-table/components/bills-mobile/constants";
import { resolveSort } from "@/app/(app)/bills/_components/bills-client/components/bills-table/components/bills-mobile/components/tools-panel/components/sort-controls/utils/resolve-sort";
import type { TBillSortColumn } from "@/features/bills";
import type { TListParams } from "@/components/data-table/types";

type TUseSortControlsResult = {
  sheetOpen: boolean;
  setSheetOpen: (open: boolean) => void;
  currentSortId: TMobileSortColumn;
  currentDesc: boolean;
  isNonDefaultSort: boolean;
  sortTriggerLabel: string;
  handleSort: (id: TBillSortColumn, desc: boolean) => void;
};

export const useSortControls = ({
  sorting,
  onSortingChange,
}: TListParams): TUseSortControlsResult => {
  const [sheetOpen, setSheetOpen] = useState(false);
  const t = useTranslations("bills.list.sort");

  const { id: currentSortId, desc: currentDesc } = resolveSort(sorting);
  const isNonDefaultSort = currentSortId !== DEFAULT_SORT_ID || currentDesc !== DEFAULT_SORT_DESC;
  const sortTriggerLabel = t(`${currentSortId}.${currentDesc ? "triggerDesc" : "triggerAsc"}`);

  const handleSort = (id: TBillSortColumn, desc: boolean) => {
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

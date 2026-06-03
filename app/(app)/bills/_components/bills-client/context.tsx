import type { TBillGlobalRow } from "@/lib/db/access/bills";
import { createSafeContext } from "@/lib/utils/create-safe-context";
import type { TSelectableEntity } from "@/components/select-input/types";

type TBillsTableContext = {
  requestDelete: (bill: TBillGlobalRow) => void;
  properties: TSelectableEntity[];
};

export const [BillsTableContext, useBillsTable] =
  createSafeContext<TBillsTableContext>("BillsTable");

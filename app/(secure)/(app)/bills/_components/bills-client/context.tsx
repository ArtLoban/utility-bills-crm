import type { TBillGlobalRow } from "@/lib/db/access/bills";
import { createSafeContext } from "@/lib/utils/create-safe-context";
import type { TPropertyOption } from "@/features/properties";

type TBillsTableContext = {
  requestDelete: (bill: TBillGlobalRow) => void;
  properties: TPropertyOption[];
};

export const [BillsTableContext, useBillsTable] =
  createSafeContext<TBillsTableContext>("BillsTable");

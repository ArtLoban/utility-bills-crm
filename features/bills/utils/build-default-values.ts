import { type DefaultValues } from "react-hook-form";

import { currentYearMonth } from "@/components/month-picker/utils";
import { isoToYearMonth } from "@/lib/format/date";
import { type TBillFormValues } from "@/features/bills/schema";
import type { TBillGlobalRow } from "@/lib/db/access/bills";

export const buildDefaultValues = (billRow?: TBillGlobalRow): DefaultValues<TBillFormValues> => {
  if (!billRow) {
    return {
      property: "",
      serviceId: "",
      month: currentYearMonth(),
      amount: "",
      notes: "",
    };
  }

  const { bill, property } = billRow;

  return {
    property: property.id,
    serviceId: bill.serviceId,
    month: isoToYearMonth(bill.periodMonth),
    amount: bill.amount,
    notes: bill.notes ?? "",
  };
};

import type { TBillRow, TSortColumn } from "@/features/bills/types";

export const getSortValue = (bill: TBillRow, col: TSortColumn): string | number => {
  switch (col) {
    case "date":
      return bill.sortTs;
    case "amount":
      return bill.amount;
    case "property":
      return bill.property.name;
    case "service":
      return bill.service.name;
    case "period":
      return bill.periodSort;
  }
};

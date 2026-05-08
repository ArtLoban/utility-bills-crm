import { TBill, TSortColumn } from "@/app/(app)/bills/_data/mock";

export const getSortValue = (bill: TBill, col: TSortColumn): string | number => {
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

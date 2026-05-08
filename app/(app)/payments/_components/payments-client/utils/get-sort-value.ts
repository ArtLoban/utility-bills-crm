import { TPayment, TSortColumn } from "@/app/(app)/payments/_data/mock";

export const getSortValue = (payment: TPayment, col: TSortColumn): string | number => {
  switch (col) {
    case "date":
      return payment.sortTs;
    case "amount":
      return payment.amount;
    case "property":
      return payment.property.name;
    case "service":
      return payment.service.name;
  }
};

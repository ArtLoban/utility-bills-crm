// devnote TODO: Move types to proper place

import { TServiceKey } from "@/lib/constants/service-colors";

export type TPaymentProperty = {
  id: string;
  name: string;
  shortName: string;
};

export type TPaymentService = {
  id: TServiceKey;
  name: string;
  unit: string | null;
};

export const PaymentField = {
  ID: "id",
  PAID_AT: "paidAt",
  PROPERTY: "property",
  SERVICE: "service",
  AMOUNT: "amount",
} as const;

export type TPayment = {
  [PaymentField.ID]: number | string; // TODO: set proper type
  [PaymentField.PAID_AT]: string;
  [PaymentField.PROPERTY]: TPaymentProperty;
  [PaymentField.SERVICE]: TPaymentService;
  [PaymentField.AMOUNT]: number;
};

// devnote TODO: Move types to proper place

import type { TServiceTypeCode } from "@/lib/constants/service-types";

export type TPaymentProperty = {
  id: string;
  name: string;
  shortName: string;
};

export type TPaymentService = {
  id: TServiceTypeCode;
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

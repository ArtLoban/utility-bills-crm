export const UPDATE_MODES = {
  TARIFF: "tariff",
  ACCOUNT: "account",
  PAYMENT: "payment",
  PROVIDER: "provider",
} as const;

export type TUpdateMode = (typeof UPDATE_MODES)[keyof typeof UPDATE_MODES];

export const TariffFormField = {
  CHANGE_DATE: "changeDate",
  RATE_T1: "rateT1",
  RATE_T2: "rateT2",
  RATE_T3: "rateT3",
  FIXED_AMOUNT: "fixedAmount",
  NOTES: "notes",
} as const;

export const AccountFormField = {
  CHANGE_DATE: "changeDate",
  VALUE: "value",
  NOTES: "notes",
} as const;

export const PaymentFormField = {
  CHANGE_DATE: "changeDate",
  DETAILS: "details",
  NOTES: "notes",
} as const;

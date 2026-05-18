import { TStringOrNull } from "@/lib/types/common";
import { PaymentField } from "@/lib/types/models/payment";

export const FiltersFormField = {
  PROPERTY: PaymentField.PROPERTY,
  SERVICE: PaymentField.SERVICE,
  PAID_AT: PaymentField.PAID_AT,
} as const;

export type TFiltersFormValues = {
  [FiltersFormField.PROPERTY]: TStringOrNull;
  [FiltersFormField.SERVICE]: TStringOrNull;
  [FiltersFormField.PAID_AT]: TStringOrNull;
};

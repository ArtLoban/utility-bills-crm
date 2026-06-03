import type { DeepPartial, UseFormReturn } from "react-hook-form";
import { TDateParams, TStringOrNull } from "@/lib/types/common";
import { PAYMENTS_FILTERS } from "@/features/payments/types";

export const FiltersFormField = {
  PROPERTY_ID: PAYMENTS_FILTERS.PROPERTY_ID,
  SERVICES: PAYMENTS_FILTERS.SERVICES,
} as const;

export type TFiltersFormValues = TDateParams & {
  [FiltersFormField.PROPERTY_ID]: TStringOrNull;
  [FiltersFormField.SERVICES]: TStringOrNull;
};

export type TQueryFilters = {
  form: UseFormReturn<TFiltersFormValues>;
  values: DeepPartial<TFiltersFormValues>;
  handleClear: () => void;
  hasActiveFilters: boolean;
};

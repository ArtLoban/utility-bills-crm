import type { DeepPartial, UseFormReturn } from "react-hook-form";
import { TDateParams, TStringOrNull } from "@/lib/types/common";
import { BILLS_FILTERS } from "@/features/bills/types";

export const FiltersFormField = {
  PROPERTY_ID: BILLS_FILTERS.PROPERTY_ID,
  SERVICES: BILLS_FILTERS.SERVICES,
  PERIOD_FROM: BILLS_FILTERS.PERIOD_FROM,
  PERIOD_TO: BILLS_FILTERS.PERIOD_TO,
} as const;

export type TFiltersFormValues = TDateParams & {
  [FiltersFormField.PROPERTY_ID]: TStringOrNull;
  [FiltersFormField.SERVICES]: TStringOrNull;
  [FiltersFormField.PERIOD_FROM]: TStringOrNull;
  [FiltersFormField.PERIOD_TO]: TStringOrNull;
};

export type TQueryFilters = {
  form: UseFormReturn<TFiltersFormValues>;
  values: DeepPartial<TFiltersFormValues>;
  handleClear: () => void;
  hasActiveFilters: boolean;
};

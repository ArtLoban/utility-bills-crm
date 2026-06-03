import type { DeepPartial, UseFormReturn } from "react-hook-form";
import { TStringOrNull } from "@/lib/types/common";

export const FiltersFormField = {
  PROPERTY_ID: "propertyId",
  SERVICE: "service",
  DATE_FROM: "dateFrom",
  DATE_TO: "dateTo",
} as const;

export type TFiltersFormValues = {
  [FiltersFormField.PROPERTY_ID]: TStringOrNull;
  [FiltersFormField.SERVICE]: TStringOrNull;
  [FiltersFormField.DATE_FROM]: TStringOrNull;
  [FiltersFormField.DATE_TO]: TStringOrNull;
};

export type TQueryFilters = {
  form: UseFormReturn<TFiltersFormValues>;
  values: DeepPartial<TFiltersFormValues>;
  handleClear: () => void;
  hasActiveFilters: boolean;
};

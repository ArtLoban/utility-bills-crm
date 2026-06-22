import type { DeepPartial, UseFormReturn } from "react-hook-form";

import { TStringOrNull } from "@/lib/types/common";
import { METERS_FILTERS, TMeterStatus } from "@/features/meters/types";

export const FiltersFormField = {
  PROPERTY_ID: METERS_FILTERS.PROPERTY_ID,
  SERVICES: METERS_FILTERS.SERVICES,
  STATUS: METERS_FILTERS.STATUS,
} as const;

export type TFiltersFormValues = {
  [FiltersFormField.PROPERTY_ID]: TStringOrNull;
  [FiltersFormField.SERVICES]: TStringOrNull;
  [FiltersFormField.STATUS]: TMeterStatus;
};

export type TQueryFilters = {
  form: UseFormReturn<TFiltersFormValues>;
  values: DeepPartial<TFiltersFormValues>;
  handleClear: () => void;
  hasActiveFilters: boolean;
};

import type { DeepPartial, UseFormReturn } from "react-hook-form";

import type { TDateParams } from "@/lib/types/common";

export type TFiltersFormValues = TDateParams;

export type TQueryFilters = {
  form: UseFormReturn<TFiltersFormValues>;
  values: DeepPartial<TFiltersFormValues>;
  handleClear: () => void;
  hasActiveFilters: boolean;
};

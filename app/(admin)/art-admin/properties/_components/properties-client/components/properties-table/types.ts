import type { DeepPartial, UseFormReturn } from "react-hook-form";

import {
  ADMIN_PROPERTIES_FILTERS,
  type TAdminPropertyStatusFilter,
} from "@/features/admin-properties/types";
import type { TStringOrNull } from "@/lib/types/common";

export const FiltersFormField = {
  STATUS: ADMIN_PROPERTIES_FILTERS.STATUS,
  TYPE: ADMIN_PROPERTIES_FILTERS.TYPE,
} as const;

export type TFiltersFormValues = {
  [FiltersFormField.STATUS]: TAdminPropertyStatusFilter;
  [FiltersFormField.TYPE]: TStringOrNull;
};

export type TQueryFilters = {
  form: UseFormReturn<TFiltersFormValues>;
  values: DeepPartial<TFiltersFormValues>;
  handleClear: () => void;
  hasActiveFilters: boolean;
};

// `owner` is a URL-only filter set by navigating from a user page (no select control):
// resolved server-side to a display name, cleared via a chip.
export type TOwnerFilter = {
  name: string | null;
  clear: () => void;
};

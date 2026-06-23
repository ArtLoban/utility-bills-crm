import type { DeepPartial, UseFormReturn } from "react-hook-form";

import { ADMIN_USERS_FILTERS, type TAdminUserStatusFilter } from "@/features/admin-users/types";
import type { TSystemRole } from "@/lib/auth/constants";

export const FiltersFormField = {
  ROLE: ADMIN_USERS_FILTERS.ROLE,
  STATUS: ADMIN_USERS_FILTERS.STATUS,
} as const;

export type TFiltersFormValues = {
  [FiltersFormField.ROLE]: TSystemRole | null;
  [FiltersFormField.STATUS]: TAdminUserStatusFilter;
};

export type TQueryFilters = {
  form: UseFormReturn<TFiltersFormValues>;
  values: DeepPartial<TFiltersFormValues>;
  handleClear: () => void;
  hasActiveFilters: boolean;
};

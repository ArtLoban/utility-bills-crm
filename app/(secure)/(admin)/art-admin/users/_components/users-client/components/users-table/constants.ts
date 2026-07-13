import { parseAsString } from "nuqs";

import type { TSelectableEntity } from "@/components/select-input/types";
import { ADMIN_USER_STATUS_FILTERS } from "@/features/admin-users/types";
import { SYSTEM_ROLES } from "@/lib/auth/constants";

import { FiltersFormField, type TFiltersFormValues } from "./types";

export const INITIAL_FILTERS: TFiltersFormValues = {
  [FiltersFormField.ROLE]: null,
  [FiltersFormField.STATUS]: ADMIN_USER_STATUS_FILTERS.ACTIVE,
};

export const URL_FIELDS = {
  [FiltersFormField.ROLE]: parseAsString,
  [FiltersFormField.STATUS]: parseAsString,
};

export const ROLE_FILTER_OPTIONS: TSelectableEntity[] = [
  { id: SYSTEM_ROLES.ADMIN, name: "Admin" },
  { id: SYSTEM_ROLES.USER, name: "User" },
];

export const STATUS_FILTER_OPTIONS: TSelectableEntity[] = [
  { id: ADMIN_USER_STATUS_FILTERS.ACTIVE, name: "Active" },
  { id: ADMIN_USER_STATUS_FILTERS.DELETED, name: "Deleted" },
  { id: ADMIN_USER_STATUS_FILTERS.ALL, name: "All" },
];

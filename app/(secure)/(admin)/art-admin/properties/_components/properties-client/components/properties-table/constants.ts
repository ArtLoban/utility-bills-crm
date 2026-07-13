import { parseAsString } from "nuqs";

import type { TSelectableEntity } from "@/components/select-input/types";
import { ADMIN_PROPERTY_STATUS_FILTERS } from "@/features/admin-properties/types";
import { PROPERTY_TYPE_LABELS, PROPERTY_TYPE_OPTIONS } from "@/features/properties/property-type";

import { FiltersFormField, type TFiltersFormValues } from "./types";

export const INITIAL_FILTERS: TFiltersFormValues = {
  [FiltersFormField.STATUS]: ADMIN_PROPERTY_STATUS_FILTERS.ACTIVE,
  [FiltersFormField.TYPE]: null,
};

export const URL_FIELDS = {
  [FiltersFormField.STATUS]: parseAsString,
  [FiltersFormField.TYPE]: parseAsString,
};

export const STATUS_FILTER_OPTIONS: TSelectableEntity[] = [
  { id: ADMIN_PROPERTY_STATUS_FILTERS.ACTIVE, name: "Active" },
  { id: ADMIN_PROPERTY_STATUS_FILTERS.DELETED, name: "Deleted" },
  { id: ADMIN_PROPERTY_STATUS_FILTERS.ALL, name: "All" },
];

export const PROPERTY_TYPE_FILTER_OPTIONS: TSelectableEntity[] = PROPERTY_TYPE_OPTIONS.map(
  ({ value }) => ({ id: value, name: PROPERTY_TYPE_LABELS[value] }),
);

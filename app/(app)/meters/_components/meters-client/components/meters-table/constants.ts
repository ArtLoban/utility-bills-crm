import { parseAsString } from "nuqs";

import { METER_STATUSES } from "@/features/meters/types";
import { FiltersFormField, TFiltersFormValues } from "./types";

export const INITIAL_FILTERS: TFiltersFormValues = {
  [FiltersFormField.PROPERTY_ID]: null,
  [FiltersFormField.SERVICES]: null,
  [FiltersFormField.STATUS]: METER_STATUSES.ACTIVE,
};

export const URL_FIELDS = {
  [FiltersFormField.PROPERTY_ID]: parseAsString,
  [FiltersFormField.SERVICES]: parseAsString,
  [FiltersFormField.STATUS]: parseAsString,
};

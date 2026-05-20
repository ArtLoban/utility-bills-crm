import { parseAsString } from "nuqs";

import { FiltersFormField, TFiltersFormValues } from "./types";

export const INITIAL_FILTERS: TFiltersFormValues = {
  [FiltersFormField.ROLE]: null,
  [FiltersFormField.STATUS]: null,
};

export const URL_FIELDS = {
  [FiltersFormField.ROLE]: parseAsString,
  [FiltersFormField.STATUS]: parseAsString,
};

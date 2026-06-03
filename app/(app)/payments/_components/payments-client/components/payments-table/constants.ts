import { FiltersFormField, TFiltersFormValues } from "./types";
import { parseAsString } from "nuqs";

export const INITIAL_FILTERS: TFiltersFormValues = {
  [FiltersFormField.PROPERTY_ID]: null,
  [FiltersFormField.SERVICE]: null,
  [FiltersFormField.DATE_FROM]: null,
  [FiltersFormField.DATE_TO]: null,
};

export const URL_FIELDS = {
  [FiltersFormField.PROPERTY_ID]: parseAsString,
  [FiltersFormField.SERVICE]: parseAsString,
  [FiltersFormField.DATE_FROM]: parseAsString,
  [FiltersFormField.DATE_TO]: parseAsString,
};

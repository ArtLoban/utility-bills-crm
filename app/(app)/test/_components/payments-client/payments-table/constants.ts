import { FiltersFormField, TFiltersFormValues } from "./types";
import { parseAsString } from "nuqs";

export const INITIAL_FILTERS: TFiltersFormValues = {
  [FiltersFormField.PROPERTY]: null,
  [FiltersFormField.SERVICE]: null,
  [FiltersFormField.PAID_AT]: null,
};

export const URL_FIELDS = {
  [FiltersFormField.PROPERTY]: parseAsString,
  [FiltersFormField.SERVICE]: parseAsString,
  [FiltersFormField.PAID_AT]: parseAsString,
};

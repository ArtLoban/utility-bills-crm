import { FiltersFormField, TFiltersFormValues } from "./types";
import { DATE_PARAMS } from "@/lib/types/common";
import { parseAsString } from "nuqs";

export const INITIAL_FILTERS: TFiltersFormValues = {
  [FiltersFormField.PROPERTY_ID]: null,
  [FiltersFormField.SERVICES]: null,
  [DATE_PARAMS.DATE_FROM]: null,
  [DATE_PARAMS.DATE_TO]: null,
};

export const URL_FIELDS = {
  [FiltersFormField.PROPERTY_ID]: parseAsString,
  [FiltersFormField.SERVICES]: parseAsString,
  [DATE_PARAMS.DATE_FROM]: parseAsString,
  [DATE_PARAMS.DATE_TO]: parseAsString,
};

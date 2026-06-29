import { parseAsString } from "nuqs";

import type { TMobileSortField, TResolvedSort } from "@/components/data-table/mobile/types";
import { DATE_PARAMS } from "@/lib/types/common";
import { READINGS_SORT_COLUMNS } from "@/features/readings/types";

import type { TFiltersFormValues } from "./types";

export const INITIAL_FILTERS: TFiltersFormValues = {
  [DATE_PARAMS.DATE_FROM]: null,
  [DATE_PARAMS.DATE_TO]: null,
};

export const URL_FIELDS = {
  [DATE_PARAMS.DATE_FROM]: parseAsString,
  [DATE_PARAMS.DATE_TO]: parseAsString,
};

export const SORT_FIELDS: readonly TMobileSortField[] = [
  { id: READINGS_SORT_COLUMNS.READ_AT, defaultDesc: true },
];

export const DEFAULT_SORT: TResolvedSort = {
  id: READINGS_SORT_COLUMNS.READ_AT,
  desc: true,
};

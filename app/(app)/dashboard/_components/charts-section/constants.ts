import { parseAsString } from "nuqs";

import { DATE_PARAMS } from "@/lib/types/common";
import { DASHBOARD_CHART_PARAMS } from "../../_data/query-params";
import type { TFiltersFormValues } from "./types";

export const INITIAL_FILTERS: TFiltersFormValues = {
  [DASHBOARD_CHART_PARAMS.PROPERTY_ID]: null,
  [DASHBOARD_CHART_PARAMS.SERVICES]: null,
  [DATE_PARAMS.DATE_FROM]: null,
  [DATE_PARAMS.DATE_TO]: null,
};

export const URL_FIELDS = {
  [DASHBOARD_CHART_PARAMS.PROPERTY_ID]: parseAsString,
  [DASHBOARD_CHART_PARAMS.SERVICES]: parseAsString,
  [DATE_PARAMS.DATE_FROM]: parseAsString,
  [DATE_PARAMS.DATE_TO]: parseAsString,
};

// Categorical colors for custom `other` series, mirroring --series-N in app/tokens.css.
// Assigned by index and cycled, so several custom services stay visually distinct.
export const CUSTOM_SERIES_COLORS = [
  "var(--series-1)",
  "var(--series-2)",
  "var(--series-3)",
  "var(--series-4)",
  "var(--series-5)",
  "var(--series-6)",
] as const;

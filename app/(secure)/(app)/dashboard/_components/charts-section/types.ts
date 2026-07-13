import type { DeepPartial, UseFormReturn } from "react-hook-form";

import type { TDateParams, TStringOrNull } from "@/lib/types/common";
import { DASHBOARD_CHART_PARAMS } from "../../_data/query-params";

export type TFiltersFormValues = TDateParams & {
  [DASHBOARD_CHART_PARAMS.PROPERTY_ID]: TStringOrNull;
  [DASHBOARD_CHART_PARAMS.SERVICES]: TStringOrNull;
};

export type TQueryFilters = {
  form: UseFormReturn<TFiltersFormValues>;
  values: DeepPartial<TFiltersFormValues>;
  handleClear: () => void;
  hasActiveFilters: boolean;
};

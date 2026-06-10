import { createLoader, parseAsString } from "nuqs/server";

import { DATE_PARAMS } from "@/lib/types/common";
import { parseAsYYYYMMDD, parseAsSemicolonArray } from "@/lib/utils/query-parsers";

// Param names deliberately match the bills list (dateFrom, dateTo, propertyId, services)
// so drill-down URLs compose to valid bills list URLs without renaming (Decision #148).
export const DASHBOARD_CHART_PARAMS = {
  DATE_FROM: DATE_PARAMS.DATE_FROM, // "dateFrom"
  DATE_TO: DATE_PARAMS.DATE_TO, // "dateTo"
  PROPERTY_ID: "propertyId",
  SERVICES: "services",
} as const;

export const dashboardChartSearchParams = {
  [DASHBOARD_CHART_PARAMS.DATE_FROM]: parseAsYYYYMMDD,
  [DASHBOARD_CHART_PARAMS.DATE_TO]: parseAsYYYYMMDD,
  [DASHBOARD_CHART_PARAMS.PROPERTY_ID]: parseAsString,
  [DASHBOARD_CHART_PARAMS.SERVICES]: parseAsSemicolonArray,
};

export const loadDashboardChartParams = createLoader(dashboardChartSearchParams);

export type TDashboardChartParams = {
  dateFrom: string | null;
  dateTo: string | null;
  propertyId: string | null;
  services: string[] | null;
};

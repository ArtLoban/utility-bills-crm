import type { TMonthlyExpensesAggregate } from "@/features/ledger";
import { SERVICE_TYPE_CODES, SERVICE_TYPE_COLORS } from "@/features/services/service-type";
import {
  resolveServiceLabel,
  resolveServiceTypeLabel,
  type TServiceTypeTranslator,
} from "@/features/services/service-label";

import { CUSTOM_SERIES_COLORS } from "./constants";

// Where a drill-down click on a series should land: a whole service type, or one
// specific custom (`other`) service. Consumed by buildBillsDrillUrl in ./utils.
export type TSeriesDrill = { kind: "type"; code: string } | { kind: "custom"; serviceId: string };

// A chart series ready to render: identity key (Recharts dataKey / chartConfig key),
// resolved label, resolved color, and its drill-down target. This is the single place
// that turns an aggregate row into label + color + drill — the charts only consume it.
export type TChartSeries = {
  key: string;
  label: string;
  color: string;
  drill: TSeriesDrill;
};

// Regular-type series keep their semantic type color; each custom `other` series gets a
// distinct palette color (cycled by its index among custom series).
export const buildChartSeries = (
  aggregate: TMonthlyExpensesAggregate,
  t: TServiceTypeTranslator,
): TChartSeries[] => {
  let customIndex = 0;

  return aggregate.services.map((series) => {
    if (series.kind === "custom") {
      const color = CUSTOM_SERIES_COLORS[customIndex % CUSTOM_SERIES_COLORS.length]!;
      customIndex += 1;
      return {
        key: series.key,
        label: resolveServiceLabel({ name: series.name, code: SERVICE_TYPE_CODES.OTHER }, t),
        color,
        drill: { kind: "custom", serviceId: series.serviceId },
      };
    }

    return {
      key: series.key,
      label: resolveServiceTypeLabel(series.code, t),
      color: SERVICE_TYPE_COLORS[series.code] ?? "var(--muted-foreground)",
      drill: { kind: "type", code: series.code },
    };
  });
};

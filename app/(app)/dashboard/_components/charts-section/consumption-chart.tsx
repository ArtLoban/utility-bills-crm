"use client";

import { useTranslations } from "next-intl";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import { ChartContainer, ChartLegend, ChartTooltip, type ChartConfig } from "@/components/ui/chart";
import type { TMonthlyConsumptionAggregate } from "@/features/meters";
import { SERVICE_TYPE_COLORS, type TServiceTypeCode } from "@/features/services/service-type";

import { ChartTooltipCard } from "./components/chart-tooltip-card";
import { LineChartLegend } from "./components/line-chart-legend";
import { formatMonthFull, formatMonthLabel, sumTooltipValues, toTooltipRows } from "./utils";

// Zone color palette for multi-zone meters — matches the meter detail consumption chart.
// Hex required because these values are set on SVG stroke attributes via ChartContainer.
const ZONE_COLORS = {
  t1: "#f59e0b",
  t2: "#6366f1",
  t3: "#10b981",
} as const;

type TProps = {
  aggregate: TMonthlyConsumptionAggregate;
};

const ConsumptionChart = ({ aggregate }: TProps) => {
  const t = useTranslations("dashboard.charts");
  const isMultiZone = aggregate.zones.length > 1;
  const serviceColor =
    SERVICE_TYPE_COLORS[aggregate.serviceTypeCode as TServiceTypeCode] ?? "var(--muted-foreground)";

  const chartConfig: ChartConfig = {
    t1: {
      label: isMultiZone ? "T1" : aggregate.unit,
      color: isMultiZone ? ZONE_COLORS.t1 : serviceColor,
    },
    t2: { label: "T2", color: ZONE_COLORS.t2 },
    t3: { label: "T3", color: ZONE_COLORS.t3 },
  };

  // Pivot: one row per month, one property per zone
  type TChartRow = Record<string, string | number>;
  const lineData: TChartRow[] = aggregate.months.map((month, i) => {
    const row: TChartRow = { month };
    for (const zone of aggregate.zones) {
      row[zone.key] = zone.monthlyConsumption[i] ?? 0;
    }
    return row;
  });

  const hasData = aggregate.zones.some((z) => z.monthlyConsumption.some((v) => v > 0));

  return (
    <>
      {hasData ? (
        <ChartContainer
          config={chartConfig}
          className="h-[320px] w-full"
          initialDimension={{ width: 560, height: 320 }}
        >
          <LineChart data={lineData} margin={{ top: 8, right: 8, left: 0, bottom: 4 }}>
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              className="stroke-zinc-100 dark:stroke-zinc-800"
            />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11.5, fill: "var(--color-muted-foreground)" }}
              tickFormatter={formatMonthLabel}
              interval="preserveStartEnd"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11.5, fill: "var(--color-muted-foreground)" }}
              width={50}
              tickFormatter={(v: number) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v))}
            />
            <ChartTooltip
              isAnimationActive={false}
              wrapperStyle={{ zIndex: 50 }}
              content={({ active, payload, label }) =>
                active && payload?.length ? (
                  <ChartTooltipCard
                    header={formatMonthFull(String(label))}
                    rows={toTooltipRows(
                      payload,
                      (key) => String(chartConfig[key]?.label ?? key),
                      (v) => `${v.toLocaleString()} ${aggregate.unit}`,
                    )}
                    total={
                      isMultiZone
                        ? {
                            label: t("tooltip.total"),
                            value: `${sumTooltipValues(payload).toLocaleString()} ${aggregate.unit}`,
                          }
                        : undefined
                    }
                  />
                ) : null
              }
            />
            {isMultiZone && (
              <ChartLegend
                align="left"
                content={() => (
                  <LineChartLegend
                    items={aggregate.zones.map((zone) => ({
                      key: zone.key,
                      label: String(chartConfig[zone.key]?.label ?? zone.key),
                      color: `var(--color-${zone.key})`,
                    }))}
                  />
                )}
              />
            )}
            {aggregate.zones.map((zone) => (
              <Line
                key={zone.key}
                type="linear"
                dataKey={zone.key}
                stroke={`var(--color-${zone.key})`}
                strokeWidth={2}
                dot={{
                  r: 2.5,
                  fill: "var(--background)",
                  stroke: `var(--color-${zone.key})`,
                  strokeWidth: 1.5,
                }}
                activeDot={{ r: 5 }}
              />
            ))}
          </LineChart>
        </ChartContainer>
      ) : (
        <div className="flex h-[320px] items-center justify-center">
          <p className="text-sm text-zinc-400 dark:text-zinc-600">
            Submit readings to see the chart.
          </p>
        </div>
      )}
    </>
  );
};

export { ConsumptionChart };

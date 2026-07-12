"use client";

import { useLocale, useTranslations } from "next-intl";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import { ChartContainer, ChartTooltip, type ChartConfig } from "@/components/ui/chart";
import { useFormatMoney } from "@/lib/format/use-format-money";
import { formatMonthShort, formatMonthYearLong, isoToYearMonth } from "@/lib/format/date";
import type { TMonthlyExpensesAggregate } from "@/features/ledger";

import { toLineData } from "../../_data/chart-transforms";
import { ChartTooltipCard } from "./components/chart-tooltip-card";
import { LineChartLegend } from "@/components/line-chart-legend";
import type { TChartSeries } from "./series";
import { formatUahTick, sumTooltipValues, toTooltipRows } from "./utils";

type TProps = {
  aggregate: TMonthlyExpensesAggregate;
  series: TChartSeries[];
};

export const TrendLineChart = ({ aggregate, series }: TProps) => {
  const t = useTranslations("dashboard.charts");
  const locale = useLocale();
  const formatMoney = useFormatMoney();
  const lineData = toLineData(aggregate);
  const labelOf = (key: string): string => series.find((s) => s.key === key)?.label ?? key;

  const chartConfig: ChartConfig = Object.fromEntries(
    series.map((s) => [s.key, { label: s.label, color: s.color }]),
  );

  return (
    <div>
      <ChartContainer
        config={chartConfig}
        className="h-80 w-full"
        initialDimension={{ width: 560, height: 320 }}
      >
        <LineChart data={lineData} margin={{ top: 8, right: 8, left: -8, bottom: 4 }}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border" />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11.5, fill: "var(--color-muted-foreground)" }}
            tickFormatter={(value) => formatMonthShort(isoToYearMonth(String(value)), locale)}
            interval="preserveStartEnd"
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11.5, fill: "var(--color-muted-foreground)" }}
            width={44}
            tickFormatter={formatUahTick}
          />
          <ChartTooltip
            isAnimationActive={false}
            wrapperStyle={{ zIndex: 50 }}
            content={({ active, payload, label }) =>
              active && payload?.length ? (
                <ChartTooltipCard
                  header={formatMonthYearLong(isoToYearMonth(String(label)), locale)}
                  rows={toTooltipRows(payload, labelOf, formatMoney)}
                  total={{
                    label: t("tooltip.total"),
                    value: formatMoney(sumTooltipValues(payload)),
                  }}
                />
              ) : null
            }
          />
          {series.map((s) => (
            <Line
              key={s.key}
              type="linear"
              dataKey={s.key}
              stroke={`var(--color-${s.key})`}
              strokeWidth={2}
              dot={{
                r: 2.5,
                fill: "var(--background)",
                stroke: `var(--color-${s.key})`,
                strokeWidth: 1.5,
              }}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      </ChartContainer>

      <LineChartLegend
        items={series.map((s) => ({
          key: s.key,
          label: s.label,
          color: s.color,
        }))}
      />
    </div>
  );
};

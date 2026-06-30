"use client";

import { useTranslations } from "next-intl";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import { ChartContainer, ChartLegend, ChartTooltip, type ChartConfig } from "@/components/ui/chart";
import { useFormatMoney } from "@/lib/format/use-format-money";
import type { TMonthlyExpensesAggregate } from "@/features/ledger";
import { SERVICE_TYPE_COLORS } from "@/features/services/service-type";

import { toLineData } from "../../_data/chart-transforms";
import { ChartTooltipCard } from "./components/chart-tooltip-card";
import { LineChartLegend } from "./components/line-chart-legend";
import {
  formatMonthFull,
  formatMonthLabel,
  formatUahTick,
  sumTooltipValues,
  toTooltipRows,
} from "./utils";

type TProps = {
  aggregate: TMonthlyExpensesAggregate;
  getServiceLabel: (code: string) => string;
};

const TrendLineChart = ({ aggregate, getServiceLabel }: TProps) => {
  const t = useTranslations("dashboard.charts");
  const formatMoney = useFormatMoney();
  const lineData = toLineData(aggregate);

  const chartConfig: ChartConfig = Object.fromEntries(
    aggregate.services.map((s) => [
      s.code,
      {
        label: getServiceLabel(s.code),
        color: SERVICE_TYPE_COLORS[s.code as keyof typeof SERVICE_TYPE_COLORS] ?? "var(--muted)",
      },
    ]),
  );

  return (
    <ChartContainer
      config={chartConfig}
      className="h-80 w-full"
      initialDimension={{ width: 560, height: 320 }}
    >
      <LineChart data={lineData} margin={{ top: 8, right: 8, left: 0, bottom: 4 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border" />
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
          width={44}
          tickFormatter={formatUahTick}
        />
        <ChartTooltip
          isAnimationActive={false}
          wrapperStyle={{ zIndex: 50 }}
          content={({ active, payload, label }) =>
            active && payload?.length ? (
              <ChartTooltipCard
                header={formatMonthFull(String(label))}
                rows={toTooltipRows(payload, getServiceLabel, formatMoney)}
                total={{ label: t("tooltip.total"), value: formatMoney(sumTooltipValues(payload)) }}
              />
            ) : null
          }
        />
        <ChartLegend
          align="left"
          content={() => (
            <LineChartLegend
              items={aggregate.services.map((s) => ({
                key: s.code,
                label: getServiceLabel(s.code),
                color: `var(--color-${s.code})`,
              }))}
            />
          )}
        />
        {aggregate.services.map((s) => (
          <Line
            key={s.code}
            type="linear"
            dataKey={s.code}
            stroke={`var(--color-${s.code})`}
            strokeWidth={2}
            dot={{
              r: 2.5,
              fill: "var(--background)",
              stroke: `var(--color-${s.code})`,
              strokeWidth: 1.5,
            }}
            activeDot={{ r: 5 }}
          />
        ))}
      </LineChart>
    </ChartContainer>
  );
};

export { TrendLineChart };

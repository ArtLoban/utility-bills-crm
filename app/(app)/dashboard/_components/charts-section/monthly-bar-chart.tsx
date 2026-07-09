"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { ChartContainer, ChartTooltip, type ChartConfig } from "@/components/ui/chart";
import { useFormatMoney } from "@/lib/format/use-format-money";
import type { TMonthlyExpensesAggregate } from "@/features/ledger";

import { toBarData } from "../../_data/chart-transforms";
import { BarChartLegend } from "./components/bar-chart-legend";
import { ChartTooltipCard } from "./components/chart-tooltip-card";
import type { TChartSeries } from "./series";
import {
  buildBillsDrillUrl,
  formatMonthFull,
  formatMonthLabel,
  formatUahTick,
  lastDayOfMonth,
  sumTooltipValues,
  toTooltipRows,
} from "./utils";
import { Surface } from "@/components/surface";

type TProps = {
  aggregate: TMonthlyExpensesAggregate;
  series: TChartSeries[];
  title: string;
  subtitle: string;
};

export const MonthlyBarChart = ({ aggregate, series, title, subtitle }: TProps) => {
  const router = useRouter();
  const t = useTranslations("dashboard.charts");
  const formatMoney = useFormatMoney();
  const [hiddenSeries, setHiddenSeries] = useState<Set<string>>(new Set());

  const barData = toBarData(aggregate);
  const seriesByKey = new Map(series.map((s) => [s.key, s]));
  const labelOf = (key: string): string => seriesByKey.get(key)?.label ?? key;

  const chartConfig: ChartConfig = Object.fromEntries(
    series.map((s) => [s.key, { label: s.label, color: s.color }]),
  );

  const toggleSeries = (key: string) => {
    setHiddenSeries((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <Surface elevation="sm" className="p-4 shadow-xs md:p-5">
      <div className="mb-4">
        <h3 className="text-foreground text-sm font-semibold tracking-tight">{title}</h3>
        <p className="text-muted-foreground mt-0.5 text-xs">{subtitle}</p>
      </div>

      <ChartContainer
        config={chartConfig}
        className="h-65 w-full"
        initialDimension={{ width: 560, height: 260 }}
      >
        <BarChart data={barData} margin={{ top: 8, right: -8, left: -8, bottom: 4 }}>
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
            <Bar
              key={s.key}
              dataKey={s.key}
              stackId="a"
              fill={`var(--color-${s.key})`}
              hide={hiddenSeries.has(s.key)}
              radius={[0, 0, 0, 0]}
              cursor="pointer"
              onClick={(data) => {
                const month = String((data as unknown as Record<string, unknown>).month);
                router.push(
                  buildBillsDrillUrl({
                    drill: s.drill,
                    dateFrom: month,
                    dateTo: lastDayOfMonth(month),
                  }),
                );
              }}
            />
          ))}
        </BarChart>
      </ChartContainer>

      <BarChartLegend
        items={series.map((s) => ({ key: s.key, label: s.label, color: s.color }))}
        hiddenKeys={hiddenSeries}
        onToggle={toggleSeries}
      />
    </Surface>
  );
};

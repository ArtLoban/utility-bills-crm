"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { TMonthlyExpensesAggregate } from "@/features/ledger";
import { SERVICE_TYPE_COLORS } from "@/features/services/service-type";

import { toBarData } from "../../_data/chart-transforms";
import { buildBillsDrillUrl, formatMonthLabel, formatUahTick, lastDayOfMonth } from "./utils";

type TProps = {
  aggregate: TMonthlyExpensesAggregate;
  dateFrom: string;
  dateTo: string;
  getServiceLabel: (code: string) => string;
};

const MonthlyBarChart = ({ aggregate, dateFrom, dateTo, getServiceLabel }: TProps) => {
  const router = useRouter();
  const [hiddenSeries, setHiddenSeries] = useState<Set<string>>(new Set());

  const barData = toBarData(aggregate);

  const chartConfig: ChartConfig = Object.fromEntries(
    aggregate.services.map((s) => [
      s.code,
      {
        label: getServiceLabel(s.code),
        color: SERVICE_TYPE_COLORS[s.code as keyof typeof SERVICE_TYPE_COLORS] ?? "var(--muted)",
      },
    ]),
  );

  const toggleSeries = (code: string) => {
    setHiddenSeries((prev) => {
      const next = new Set(prev);
      next.has(code) ? next.delete(code) : next.add(code);
      return next;
    });
  };

  return (
    <div className="overflow-hidden rounded-[8px] border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <ChartContainer
        config={chartConfig}
        className="h-[260px] w-full"
        initialDimension={{ width: 560, height: 260 }}
      >
        <BarChart data={barData} margin={{ top: 8, right: 8, left: 0, bottom: 4 }}>
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
            width={44}
            tickFormatter={formatUahTick}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                labelFormatter={(label) => formatMonthLabel(String(label))}
                formatter={(value) => [
                  typeof value === "number" ? `${value.toLocaleString()} UAH` : String(value),
                ]}
              />
            }
          />
          <ChartLegend
            content={({ payload }) => (
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                {payload?.map((item) => {
                  const code = String(item.dataKey);
                  const hidden = hiddenSeries.has(code);
                  return (
                    <button
                      key={code}
                      type="button"
                      onClick={() => toggleSeries(code)}
                      className="flex cursor-pointer items-center gap-1.5 rounded px-1 text-xs transition-opacity"
                      style={{ opacity: hidden ? 0.4 : 1 }}
                    >
                      <span
                        className="h-2 w-2 shrink-0 rounded-[2px]"
                        style={{ backgroundColor: item.color }}
                      />
                      {item.value}
                    </button>
                  );
                })}
              </div>
            )}
          />
          {aggregate.services.map((s) => (
            <Bar
              key={s.code}
              dataKey={s.code}
              stackId="a"
              fill={`var(--color-${s.code})`}
              hide={hiddenSeries.has(s.code)}
              radius={[0, 0, 0, 0]}
              cursor="pointer"
              onClick={(data) => {
                const month = String((data as unknown as Record<string, unknown>).month);
                router.push(
                  buildBillsDrillUrl({
                    services: [s.code],
                    dateFrom: month,
                    dateTo: lastDayOfMonth(month),
                  }),
                );
              }}
            />
          ))}
        </BarChart>
      </ChartContainer>
    </div>
  );
};

export { MonthlyBarChart };

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { ChartContainer, ChartLegend, ChartTooltip, type ChartConfig } from "@/components/ui/chart";
import { DataCard } from "@/components/data-card";
import { cn } from "@/lib/utils";
import { useFormatMoney } from "@/lib/format/use-format-money";
import type { TMonthlyExpensesAggregate } from "@/features/ledger";
import { SERVICE_TYPE_COLORS } from "@/features/services/service-type";

import { toBarData } from "../../_data/chart-transforms";
import { ChartTooltipCard } from "./components/chart-tooltip-card";
import {
  buildBillsDrillUrl,
  formatMonthFull,
  formatMonthLabel,
  formatUahTick,
  lastDayOfMonth,
  sumTooltipValues,
  toTooltipRows,
} from "./utils";

type TProps = {
  aggregate: TMonthlyExpensesAggregate;
  title: string;
  subtitle: string;
  getServiceLabel: (code: string) => string;
};

export const MonthlyBarChart = ({ aggregate, title, subtitle, getServiceLabel }: TProps) => {
  const router = useRouter();
  const t = useTranslations("dashboard.charts");
  const formatMoney = useFormatMoney();
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
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  };

  return (
    <DataCard className="p-5">
      <div className="mb-4">
        <h3 className="text-foreground text-sm font-semibold tracking-tight">{title}</h3>
        <p className="text-muted-foreground mt-0.5 text-xs">{subtitle}</p>
      </div>

      <ChartContainer
        config={chartConfig}
        className="h-65 w-full"
        initialDimension={{ width: 560, height: 260 }}
      >
        <BarChart data={barData} margin={{ top: 8, right: 8, left: 0, bottom: 4 }}>
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
                  total={{
                    label: t("tooltip.total"),
                    value: formatMoney(sumTooltipValues(payload)),
                  }}
                />
              ) : null
            }
          />
          <ChartLegend
            align="left"
            content={({ payload }) => (
              <div className="flex flex-wrap items-center gap-2 pt-3">
                {payload?.map((item) => {
                  const code = String(item.dataKey);
                  const hidden = hiddenSeries.has(code);
                  return (
                    <button
                      key={code}
                      type="button"
                      onClick={() => toggleSeries(code)}
                      className={cn(
                        "hover:bg-muted flex cursor-pointer items-center gap-1.5 rounded px-1.5 py-0.5 text-xs transition-colors",
                        hidden && "text-muted-foreground line-through",
                      )}
                    >
                      <span
                        className="h-2 w-2 shrink-0 rounded-[2px]"
                        style={{ backgroundColor: hidden ? "var(--border)" : item.color }}
                      />
                      {getServiceLabel(code)}
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
    </DataCard>
  );
};

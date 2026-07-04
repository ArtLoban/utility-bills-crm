"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Cell, Pie, PieChart } from "recharts";

import { ChartContainer, ChartTooltip, type ChartConfig } from "@/components/ui/chart";
import { useFormatMoney } from "@/lib/format/use-format-money";
import type { TMonthlyExpensesAggregate } from "@/features/ledger";

import { toPieData } from "../../../_data/chart-transforms";
import { ChartTooltipCard } from "../components/chart-tooltip-card";
import { buildBillsDrillUrl } from "../utils";
import type { TChartSeries } from "../series";
import { PieLegend, type TPieLegendItem } from "./components/pie-legend";
import { Surface } from "@/components/surface";

type TProps = {
  aggregate: TMonthlyExpensesAggregate;
  series: TChartSeries[];
  dateFrom: string;
  dateTo: string;
  title: string;
  subtitle: string;
};

export const ExpensePieChart = ({
  aggregate,
  series,
  dateFrom,
  dateTo,
  title,
  subtitle,
}: TProps) => {
  const router = useRouter();
  const t = useTranslations("dashboard.charts");
  const formatMoney = useFormatMoney();
  const pieData = toPieData(aggregate);
  const seriesByKey = new Map(series.map((s) => [s.key, s]));

  const chartConfig: ChartConfig = Object.fromEntries(
    series.map((s) => [s.key, { label: s.label, color: s.color }]),
  );

  const total = pieData.reduce((sum, e) => sum + e.total, 0);
  const legendItems: TPieLegendItem[] = pieData.map((e) => ({
    key: e.key,
    label: seriesByKey.get(e.key)?.label ?? e.key,
    color: seriesByKey.get(e.key)?.color ?? "var(--muted-foreground)",
    percent: total > 0 ? Math.round((e.total / total) * 100) : 0,
  }));

  return (
    <Surface elevation="sm" className="p-6 shadow-xs">
      <div>
        <h3 className="text-foreground text-sm font-semibold tracking-tight">{title}</h3>
        <p className="text-muted-foreground mt-0.5 text-xs">{subtitle}</p>
      </div>

      {pieData.length === 0 ? (
        <div className="flex h-50 items-center justify-center">
          <p className="text-muted-foreground text-sm">{t("pie.noData")}</p>
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-1 items-center gap-6 sm:grid-cols-[minmax(0,200px)_1fr]">
          <div className="relative mx-auto size-50">
            <ChartContainer
              config={chartConfig}
              className="h-50 w-full"
              initialDimension={{ width: 200, height: 200 }}
            >
              <PieChart>
                <ChartTooltip
                  isAnimationActive={false}
                  wrapperStyle={{ zIndex: 50 }}
                  content={({ active, payload }) =>
                    active && payload?.length ? (
                      <ChartTooltipCard
                        rows={payload.map((p) => {
                          const key = String(p.name);
                          return {
                            key,
                            label: seriesByKey.get(key)?.label ?? key,
                            color: typeof p.color === "string" ? p.color : `var(--color-${key})`,
                            value: formatMoney(typeof p.value === "number" ? p.value : 0),
                          };
                        })}
                      />
                    ) : null
                  }
                />
                <Pie
                  data={pieData}
                  dataKey="total"
                  nameKey="key"
                  cx="50%"
                  cy="50%"
                  innerRadius="56%"
                  outerRadius="90%"
                  paddingAngle={2}
                  cursor="pointer"
                  onClick={(entry) => {
                    const key = (entry as unknown as { key: string }).key;
                    const drill = seriesByKey.get(key)?.drill;
                    if (drill) router.push(buildBillsDrillUrl({ drill, dateFrom, dateTo }));
                  }}
                >
                  {pieData.map((entry) => (
                    <Cell key={entry.key} fill={`var(--color-${entry.key})`} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>

            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                {t("pie.total")}
              </span>
              <span className="text-foreground mt-0.5 text-2xl font-semibold tracking-tight tabular-nums">
                {formatMoney(total)}
              </span>
            </div>
          </div>

          <PieLegend items={legendItems} />
        </div>
      )}
    </Surface>
  );
};

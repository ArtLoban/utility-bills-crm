"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Cell, Pie, PieChart } from "recharts";

import { ChartContainer, ChartTooltip, type ChartConfig } from "@/components/ui/chart";
import { DataCard } from "@/components/data-card";
import { useFormatMoney } from "@/lib/format/use-format-money";
import type { TMonthlyExpensesAggregate } from "@/features/ledger";
import { SERVICE_TYPE_COLORS } from "@/features/services/service-type";

import { toPieData } from "../../../_data/chart-transforms";
import { ChartTooltipCard } from "../components/chart-tooltip-card";
import { buildBillsDrillUrl } from "../utils";
import { PieLegend, type TPieLegendItem } from "./components/pie-legend";

type TProps = {
  aggregate: TMonthlyExpensesAggregate;
  dateFrom: string;
  dateTo: string;
  title: string;
  subtitle: string;
  getServiceLabel: (code: string) => string;
};

const serviceColor = (code: string): string =>
  SERVICE_TYPE_COLORS[code as keyof typeof SERVICE_TYPE_COLORS] ?? "var(--muted)";

export const ExpensePieChart = ({
  aggregate,
  dateFrom,
  dateTo,
  title,
  subtitle,
  getServiceLabel,
}: TProps) => {
  const router = useRouter();
  const t = useTranslations("dashboard.charts");
  const formatMoney = useFormatMoney();
  const pieData = toPieData(aggregate);

  const chartConfig: ChartConfig = Object.fromEntries(
    aggregate.services.map((s) => [
      s.code,
      { label: getServiceLabel(s.code), color: serviceColor(s.code) },
    ]),
  );

  const total = pieData.reduce((sum, e) => sum + e.total, 0);
  const legendItems: TPieLegendItem[] = pieData.map((e) => ({
    code: e.code,
    label: getServiceLabel(e.code),
    color: serviceColor(e.code),
    percent: total > 0 ? Math.round((e.total / total) * 100) : 0,
  }));

  return (
    <DataCard className="p-6">
      <div>
        <h3 className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {title}
        </h3>
        <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">{subtitle}</p>
      </div>

      {pieData.length === 0 ? (
        <div className="flex h-[200px] items-center justify-center">
          <p className="text-sm text-zinc-400 dark:text-zinc-500">{t("pie.noData")}</p>
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-1 items-center gap-6 sm:grid-cols-[minmax(0,200px)_1fr]">
          <div className="relative mx-auto h-[200px] w-[200px]">
            <ChartContainer
              config={chartConfig}
              className="h-[200px] w-full"
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
                          const code = String(p.name);
                          return {
                            key: code,
                            label: getServiceLabel(code),
                            color: typeof p.color === "string" ? p.color : `var(--color-${code})`,
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
                  nameKey="code"
                  cx="50%"
                  cy="50%"
                  innerRadius="56%"
                  outerRadius="90%"
                  paddingAngle={2}
                  cursor="pointer"
                  onClick={(entry) => {
                    const code = (entry as unknown as { code: string }).code;
                    router.push(buildBillsDrillUrl({ services: [code], dateFrom, dateTo }));
                  }}
                >
                  {pieData.map((entry) => (
                    <Cell key={entry.code} fill={`var(--color-${entry.code})`} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>

            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-muted-foreground text-[10.5px] font-medium tracking-[0.4px] uppercase">
                {t("pie.total")}
              </span>
              <span className="mt-0.5 text-2xl font-semibold tracking-[-0.5px] text-zinc-900 tabular-nums dark:text-zinc-50">
                {formatMoney(total)}
              </span>
            </div>
          </div>

          <PieLegend items={legendItems} />
        </div>
      )}
    </DataCard>
  );
};

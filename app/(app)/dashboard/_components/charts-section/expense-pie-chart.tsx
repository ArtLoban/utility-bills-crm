"use client";

import { useRouter } from "next/navigation";
import { Cell, Pie, PieChart } from "recharts";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { TMonthlyExpensesAggregate } from "@/features/ledger";
import { SERVICE_TYPE_COLORS } from "@/features/services/service-type";

import { toPieData } from "../../_data/chart-transforms";
import { buildBillsDrillUrl } from "./utils";

type TProps = {
  aggregate: TMonthlyExpensesAggregate;
  dateFrom: string;
  dateTo: string;
  getServiceLabel: (code: string) => string;
};

const ExpensePieChart = ({ aggregate, dateFrom, dateTo, getServiceLabel }: TProps) => {
  const router = useRouter();
  const pieData = toPieData(aggregate);

  const chartConfig: ChartConfig = Object.fromEntries(
    aggregate.services.map((s) => [
      s.code,
      {
        label: getServiceLabel(s.code),
        color: SERVICE_TYPE_COLORS[s.code as keyof typeof SERVICE_TYPE_COLORS] ?? "var(--muted)",
      },
    ]),
  );

  if (pieData.length === 0) {
    return (
      <div className="flex h-[260px] items-center justify-center rounded-[8px] border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-sm text-zinc-400 dark:text-zinc-500">No data for this period.</p>
      </div>
    );
  }

  const total = pieData.reduce((sum, e) => sum + e.total, 0);

  return (
    <div className="overflow-hidden rounded-[8px] border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <ChartContainer
        config={chartConfig}
        className="h-[260px] w-full"
        initialDimension={{ width: 340, height: 260 }}
      >
        <PieChart>
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value) => [
                  typeof value === "number" ? `${value.toLocaleString()} UAH` : String(value),
                ]}
                hideLabel
              />
            }
          />
          <Pie
            data={pieData}
            dataKey="total"
            nameKey="code"
            cx="50%"
            cy="45%"
            innerRadius="52%"
            outerRadius="72%"
            paddingAngle={2}
            cursor="pointer"
            onClick={(entry) => {
              const code = (entry as unknown as { code: string }).code;
              router.push(buildBillsDrillUrl({ services: [code], dateFrom, dateTo }));
            }}
            label={({ cx, cy }: { cx: number; cy: number }) => (
              <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central">
                <tspan x={cx} dy="-0.35em" fontSize={15} fontWeight={600} fill="currentColor">
                  {total >= 1000 ? `${(total / 1000).toFixed(1)}k` : total.toLocaleString()}
                </tspan>
                <tspan x={cx} dy="1.3em" fontSize={11} fill="var(--muted-foreground)">
                  UAH
                </tspan>
              </text>
            )}
            labelLine={false}
          >
            {pieData.map((entry) => (
              <Cell key={entry.code} fill={`var(--color-${entry.code})`} />
            ))}
          </Pie>
          <ChartLegend content={<ChartLegendContent />} verticalAlign="bottom" />
        </PieChart>
      </ChartContainer>
    </div>
  );
};

export { ExpensePieChart };

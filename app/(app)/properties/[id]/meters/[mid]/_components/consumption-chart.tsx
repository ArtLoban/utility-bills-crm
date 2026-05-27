"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { TReading } from "@/lib/db/schema/readings";
import type { TMeter } from "@/lib/db/schema/meters";
import type { TServiceType } from "@/lib/db/schema/service-types";
import { getServiceTypeVisuals, TServiceTypeCode } from "@/features/services/service-type";

// Zone palette — same values as mock; hex required for Recharts SVG strokes.
const ZONE_COLORS = {
  t1: "#f59e0b",
  t2: "#6366f1",
  t3: "#10b981",
} as const;

type TChartPoint = {
  label: string;
  t1: number;
  t2?: number;
  t3?: number;
};

type TProps = {
  readings: TReading[];
  meter: TMeter;
  serviceType: TServiceType;
};

const ConsumptionChart = ({ readings, meter, serviceType }: TProps) => {
  if (readings.length === 0) {
    return (
      <div
        className="rounded-[8px] border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800/30"
        style={{ padding: "32px 24px", textAlign: "center" }}
      >
        <p className="text-sm text-zinc-400 dark:text-zinc-600">
          Submit readings to see the chart.
        </p>
      </div>
    );
  }

  const { color: serviceColor } = getServiceTypeVisuals(serviceType.code as TServiceTypeCode);
  const t1Color = meter.zoneCount === 1 ? serviceColor : ZONE_COLORS.t1;

  const chartConfig: ChartConfig = {
    t1: {
      label:
        meter.zoneCount === 1
          ? `Value (${serviceType.unit ?? "units"})`
          : `T1 day (${serviceType.unit ?? "units"})`,
      color: t1Color,
    },
    ...(meter.zoneCount >= 2
      ? { t2: { label: `T2 night (${serviceType.unit ?? "units"})`, color: ZONE_COLORS.t2 } }
      : {}),
    ...(meter.zoneCount === 3
      ? { t3: { label: `T3 peak (${serviceType.unit ?? "units"})`, color: ZONE_COLORS.t3 } }
      : {}),
  };

  // Readings arrive sorted DESC; reverse for chronological order on the X axis.
  const data: TChartPoint[] = readings
    .slice()
    .reverse()
    .map((r) => ({
      label: new Date(r.readAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "2-digit",
      }),
      t1: parseFloat(r.valueT1),
      ...(r.valueT2 != null ? { t2: parseFloat(r.valueT2) } : {}),
      ...(r.valueT3 != null ? { t3: parseFloat(r.valueT3) } : {}),
    }));

  const showLegend = meter.zoneCount > 1;

  return (
    <div className="overflow-hidden rounded-[8px] border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <ChartContainer config={chartConfig} className="h-[220px] w-full">
        <LineChart data={data} margin={{ top: 16, right: 24, left: 0, bottom: 4 }}>
          <CartesianGrid
            vertical={false}
            strokeDasharray="3 3"
            className="stroke-zinc-100 dark:stroke-zinc-800"
          />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11.5, fill: "var(--color-muted-foreground)" }}
            interval="preserveStartEnd"
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11.5, fill: "var(--color-muted-foreground)" }}
            width={52}
            tickFormatter={(v: number) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v))}
          />
          <ChartTooltip content={<ChartTooltipContent labelKey="label" indicator="line" />} />
          {showLegend && <ChartLegend content={<ChartLegendContent />} />}
          <Line
            type="monotone"
            dataKey="t1"
            stroke={t1Color}
            strokeWidth={2}
            dot={data.length <= 24}
            activeDot={{ r: 4 }}
          />
          {meter.zoneCount >= 2 && (
            <Line
              type="monotone"
              dataKey="t2"
              stroke={ZONE_COLORS.t2}
              strokeWidth={2}
              dot={data.length <= 24}
              activeDot={{ r: 4 }}
            />
          )}
          {meter.zoneCount === 3 && (
            <Line
              type="monotone"
              dataKey="t3"
              stroke={ZONE_COLORS.t3}
              strokeWidth={2}
              dot={data.length <= 24}
              activeDot={{ r: 4 }}
            />
          )}
        </LineChart>
      </ChartContainer>
    </div>
  );
};

export { ConsumptionChart };

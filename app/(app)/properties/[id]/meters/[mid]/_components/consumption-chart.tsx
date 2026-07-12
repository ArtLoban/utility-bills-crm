"use client";

import { TrendingUp } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { LineChartLegend } from "@/components/line-chart-legend";
import { SectionCard } from "@/components/section-card";
import { SectionCardEmpty } from "@/components/section-card-empty";
import { ZONE_COLOR_VARS, ZONE_SHORT_TAGS } from "@/lib/constants/zones";
import type { TReading } from "@/lib/db/schema/readings";
import type { TMeter } from "@/lib/db/schema/meters";
import type { TServiceType } from "@/lib/db/schema/service-types";
import { createUnitLabeler } from "@/features/readings/format";
import { getServiceTypeVisuals, TServiceTypeCode } from "@/features/services/service-type";

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

export const ConsumptionChart = ({ readings, meter, serviceType }: TProps) => {
  const t = useTranslations("meters.detail");
  const locale = useLocale();

  if (readings.length === 0) {
    return (
      <SectionCard title={t("consumption.title")}>
        <SectionCardEmpty icon={TrendingUp} caption={t("consumption.empty")} />
      </SectionCard>
    );
  }

  const { color: serviceColor } = getServiceTypeVisuals(serviceType.code as TServiceTypeCode);
  const withUnit = createUnitLabeler(serviceType.unit, (label, unit) =>
    t("series.withUnit", { label, unit }),
  );

  const t1Color = meter.zoneCount === 1 ? serviceColor : ZONE_COLOR_VARS[0];

  const series: { key: "t1" | "t2" | "t3"; label: string; color: string }[] = [
    {
      key: "t1",
      label: meter.zoneCount === 1 ? withUnit(t("series.value")) : withUnit(ZONE_SHORT_TAGS[0]),
      color: t1Color,
    },
    ...(meter.zoneCount >= 2
      ? [{ key: "t2" as const, label: withUnit(ZONE_SHORT_TAGS[1]), color: ZONE_COLOR_VARS[1] }]
      : []),
    ...(meter.zoneCount === 3
      ? [{ key: "t3" as const, label: withUnit(ZONE_SHORT_TAGS[2]), color: ZONE_COLOR_VARS[2] }]
      : []),
  ];

  const chartConfig: ChartConfig = Object.fromEntries(
    series.map((s) => [s.key, { label: s.label, color: s.color }]),
  );

  const formatAxisDate = new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    year: "2-digit",
  });

  // Readings arrive sorted DESC; reverse for chronological order on the X axis.
  const data: TChartPoint[] = readings
    .slice()
    .reverse()
    .map((r) => ({
      label: formatAxisDate.format(new Date(r.readAt)),
      t1: parseFloat(r.valueT1),
      ...(r.valueT2 != null ? { t2: parseFloat(r.valueT2) } : {}),
      ...(r.valueT3 != null ? { t3: parseFloat(r.valueT3) } : {}),
    }));

  const showLegend = series.length > 1;

  return (
    <SectionCard title={t("consumption.title")}>
      <div className="px-4 pt-2 pb-4">
        <ChartContainer config={chartConfig} className="h-55 w-full">
          <LineChart data={data} margin={{ top: 16, right: 4, left: -16, bottom: 4 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border/60" />
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
            {series.map((s) => (
              <Line
                key={s.key}
                type="monotone"
                dataKey={s.key}
                stroke={s.color}
                strokeWidth={2}
                dot={data.length <= 24}
                activeDot={{ r: 4 }}
              />
            ))}
          </LineChart>
        </ChartContainer>

        {showLegend && (
          <LineChartLegend
            items={series.map((s) => ({ key: s.key, label: s.label, color: s.color }))}
          />
        )}
      </div>
    </SectionCard>
  );
};

"use client";

import { TrendingUp } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { SectionCard } from "@/components/section-card";
import { SectionCardEmpty } from "@/components/section-card-empty";
import { UNIT_LABELS, ZONE_COLORS_HEX } from "@/lib/constants/zones";
import type { TReading } from "@/lib/db/schema/readings";
import type { TMeter } from "@/lib/db/schema/meters";
import type { TServiceType } from "@/lib/db/schema/service-types";
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
  const unitLabel = serviceType.unit ? UNIT_LABELS[serviceType.unit] : "";
  const withUnit = (label: string) =>
    unitLabel ? t("series.withUnit", { label, unit: unitLabel }) : label;

  const t1Color = meter.zoneCount === 1 ? serviceColor : ZONE_COLORS_HEX[0];

  const chartConfig: ChartConfig = {
    t1: {
      label: meter.zoneCount === 1 ? withUnit(t("series.value")) : withUnit(t("series.t1")),
      color: t1Color,
    },
    ...(meter.zoneCount >= 2
      ? { t2: { label: withUnit(t("series.t2")), color: ZONE_COLORS_HEX[1] } }
      : {}),
    ...(meter.zoneCount === 3
      ? { t3: { label: withUnit(t("series.t3")), color: ZONE_COLORS_HEX[2] } }
      : {}),
  };

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

  const showLegend = meter.zoneCount > 1;

  return (
    <SectionCard title={t("consumption.title")}>
      <div className="px-2 pt-2 pb-4">
        <ChartContainer config={chartConfig} className="h-[220px] w-full">
          <LineChart data={data} margin={{ top: 16, right: 24, left: 0, bottom: 4 }}>
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
                stroke={ZONE_COLORS_HEX[1]}
                strokeWidth={2}
                dot={data.length <= 24}
                activeDot={{ r: 4 }}
              />
            )}
            {meter.zoneCount === 3 && (
              <Line
                type="monotone"
                dataKey="t3"
                stroke={ZONE_COLORS_HEX[2]}
                strokeWidth={2}
                dot={data.length <= 24}
                activeDot={{ r: 4 }}
              />
            )}
          </LineChart>
        </ChartContainer>
      </div>
    </SectionCard>
  );
};

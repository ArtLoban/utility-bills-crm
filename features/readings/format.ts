import { ZONE_SHORT_TAGS } from "@/lib/constants/zones";
import type { TReading } from "@/lib/db/schema/readings";

export const formatReadingValue = (value: string | null): string => {
  if (value === null) return "—";
  return parseFloat(value).toLocaleString("en-US", { maximumFractionDigits: 3 });
};

export const formatReadingNumber = (value: number): string =>
  value.toLocaleString("en-US", { maximumFractionDigits: 3 });

export const formatReadingDelta = (delta: number): string =>
  `${delta >= 0 ? "+" : ""}${formatReadingNumber(delta)}`;

export const formatReadingZones = (reading: TReading, zoneCount: number): string => {
  const values = [reading.valueT1, reading.valueT2, reading.valueT3].slice(0, zoneCount);

  if (zoneCount <= 1) return formatReadingValue(reading.valueT1);

  return values
    .map((value, index) => {
      const tag = ZONE_SHORT_TAGS[index] ?? `T${index + 1}`;
      return `${tag}: ${formatReadingValue(value)}`;
    })
    .join(" / ");
};

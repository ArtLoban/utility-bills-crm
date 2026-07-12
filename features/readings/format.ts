import { UNIT_LABELS, ZONE_SHORT_TAGS } from "@/lib/constants/zones";
import type { TReading } from "@/lib/db/schema/readings";
import type { TServiceType } from "@/lib/db/schema/service-types";

/**
 * Builds a `withUnit(label)` helper that appends the service unit to a series/zone
 * label — or returns the label unchanged when the service has no unit. The caller
 * supplies the composition `format` (e.g. an i18n template), so the parenthesized
 * chart style and the comma-separated table-header style share one code path.
 */
export const createUnitLabeler = (
  unit: TServiceType["unit"],
  format: (label: string, unit: string) => string,
) => {
  const unitLabel = unit ? UNIT_LABELS[unit] : "";
  return (label: string): string => (unitLabel ? format(label, unitLabel) : label);
};

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

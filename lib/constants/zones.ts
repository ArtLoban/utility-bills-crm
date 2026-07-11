import type { TServiceTypeUnit } from "@/lib/db/schema/service-types";
import type { TTariff } from "@/lib/db/schema/tariffs";

export const METER_ZONE_COUNTS = [1, 2, 3] as const;
export type TZoneCount = (typeof METER_ZONE_COUNTS)[number]; // 1 | 2 | 3

export const ZONE_COUNT_VALUES = ["1", "2", "3"] as const;
export type TZoneCountValue = (typeof ZONE_COUNT_VALUES)[number]; // "1" | "2" | "3"

export const ZONE_COLOR_VARS: readonly [string, string, string] = [
  "var(--zone-t1)",
  "var(--zone-t2)",
  "var(--zone-t3)",
];
export const FIXED_RATE_COLOR_VAR = "var(--rate-fixed)";

export const UNIT_LABELS: Record<TServiceTypeUnit, string> = {
  kwh: "kWh",
  m3: "m³",
  gcal: "Gcal",
};

// --- Canonical zone vocabulary (single source of truth) ---
// Zone labels themselves live in the cross-cutting `zones` i18n namespace; these maps own
// the count-aware key selection so every surface renders identical wording.

// Ordered i18n leaf keys under the `zones` namespace, per zone count.
export const ZONE_LABEL_KEYS = {
  1: ["single"],
  2: ["t1Day", "t2Night"],
  3: ["t1Peak", "t2Shoulder", "t3OffPeak"],
} as const satisfies Record<TZoneCount, readonly string[]>;

// Zone-count summary key (`zones` namespace), per zone count.
export const ZONE_SUMMARY_KEYS = {
  1: "summary.single",
  2: "summary.two",
  3: "summary.three",
} as const satisfies Record<TZoneCount, string>;

// Count-independent short tier tags for chart legends/axes and compact cells.
export const ZONE_SHORT_TAGS = ["T1", "T2", "T3"] as const;

// Number of populated rate zones for a metered tariff, counted contiguously from T1.
// Relies on the DB tariffs_zones_contiguous_check: rates have no gaps, so the first null
// ends the count. Caller passes a metered tariff (rateT1 is non-null).
export const tariffZoneCount = (tariff: Pick<TTariff, "rateT2" | "rateT3">): TZoneCount => {
  if (tariff.rateT2 == null) return 1;
  if (tariff.rateT3 == null) return 2;
  return 3;
};

// Accessors bridging a raw `number` zone count (e.g. meter.zoneCount) to the typed maps,
// so call sites never cast. Out-of-range counts fall back to the single-zone entry.
export const zoneLabelKeys = (zoneCount: number): readonly string[] =>
  zoneCount === 2 ? ZONE_LABEL_KEYS[2] : zoneCount === 3 ? ZONE_LABEL_KEYS[3] : ZONE_LABEL_KEYS[1];

export const zoneSummaryKey = (zoneCount: number): string =>
  zoneCount === 2
    ? ZONE_SUMMARY_KEYS[2]
    : zoneCount === 3
      ? ZONE_SUMMARY_KEYS[3]
      : ZONE_SUMMARY_KEYS[1];

import type { TServiceTypeUnit } from "@/lib/db/schema/service-types";

export const ZONE_COLOR_VARS: readonly [string, string, string] = [
  "var(--zone-t1)",
  "var(--zone-t2)",
  "var(--zone-t3)",
];
export const FIXED_RATE_COLOR_VAR = "var(--rate-fixed)";

// Hex mirror of --zone-t{1,2,3} for Recharts SVG strokes (SVG can't resolve CSS vars).
// Keep in sync with tokens.css --amber-500 / --blue-500 / --violet-500.
export const ZONE_COLORS_HEX = ["#f59e0b", "#3b82f6", "#8b5cf6"] as const;

export const UNIT_LABELS: Record<TServiceTypeUnit, string> = {
  kwh: "kWh",
  m3: "m³",
  gcal: "Gcal",
};

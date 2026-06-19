import type { TServiceTypeUnit } from "@/lib/db/schema/service-types";

export const ZONE_COLOR_VARS = ["var(--zone-t1)", "var(--zone-t2)", "var(--zone-t3)"];
export const FIXED_RATE_COLOR_VAR = "var(--rate-fixed)";

export const UNIT_LABELS: Record<TServiceTypeUnit, string> = {
  kwh: "kWh",
  m3: "m³",
  gcal: "Gcal",
};

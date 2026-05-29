import { TIME_PERIOD } from "./types";
import type { TPreset } from "./types";

export const PRESETS: readonly TPreset[] = [
  { id: TIME_PERIOD.THIS_MONTH, label: "This month" },
  { id: TIME_PERIOD.LAST_MONTH, label: "Last month" },
  { id: TIME_PERIOD.THIS_YEAR, label: "This year" },
  { id: TIME_PERIOD.LAST_6_MONTHS, label: "Last 6 months" },
  { id: TIME_PERIOD.LAST_12_MONTHS, label: "Last 12 months" },
] as const;

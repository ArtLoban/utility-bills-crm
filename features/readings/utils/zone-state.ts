import type { TZoneState } from "../types";
import { parseReadingValue } from "./parse-value";

export const toLastValue = (raw: string | null): number | null =>
  raw != null ? Number(raw) : null;

export const deriveZoneState = (current: string, lastValue: number | null): TZoneState => {
  const parsed = parseReadingValue(current);

  const filled = parsed !== undefined;
  const warning = filled && lastValue !== null && parsed < lastValue;
  const delta = filled && lastValue !== null && !warning ? parsed - lastValue : null;

  return {
    lastValue,
    warning,
    delta,
  };
};

// Demo-seed generation core (pure, no DB access).
//
// Every consumption value is a deterministic function of the CALENDAR (year, month) and the
// series identity — never Math.random, never keyed to a position in the sliding window. The same
// (series, year, month) therefore produces the same number on every run, and seasonal peaks always
// land in the correct calendar month regardless of when the seed runs.
//
// Shape of a value: seasonal baseline (per calendar month) × winter severity (heating months of
// heating-driven series only) × deterministic jitter. The jitter pushes readings/amounts off
// suspiciously round figures; the severity makes each winter differ in shape rather than being one
// template scaled by a flat drift.

import { hashString } from "@/lib/utils/hash-string";

// --- Series identity (stable keys for jitter; NOT the DB uuids, which are random per run) ---

export const SEED_SERIES = {
  APT_ELECTRICITY_DAY: "apt:electricity:day",
  APT_ELECTRICITY_NIGHT: "apt:electricity:night",
  APT_GAS: "apt:gas",
  // Apartment cold water is metered by TWO risers feeding one service (Tranche B). The two series
  // are independent (own jitter) but their baselines sum to the single cold-water concept target.
  APT_COLD_WATER_KITCHEN: "apt:cold-water:kitchen",
  APT_COLD_WATER_BATH: "apt:cold-water:bath",
  APT_HOT_WATER: "apt:hot-water",
  HOUSE_ELECTRICITY: "house:electricity",
  HOUSE_GAS: "house:gas",
  HOUSE_COLD_WATER: "house:cold-water",
  COTTAGE_ELECTRICITY: "cottage:electricity",
} as const;

export type TSeedSeries = (typeof SEED_SERIES)[keyof typeof SEED_SERIES];

// Heating is billed as a fixed-type service (no meter, no consumption series), but its monthly
// amount is driven by a Gcal figure, so it still needs a stable jitter key.
const HEATING_JITTER_KEY = "apt:heating";

// --- Tariff base (real Kyiv, mostly flat under the moratorium) ---

export const SEED_TARIFF_RATES = {
  ELECTRICITY_DAY: 4.32,
  ELECTRICITY_NIGHT: 2.16,
  GAS_SUPPLY: 7.96,
  COLD_WATER: 30.384,
  HOT_WATER: 97.89,
} as const;

// Heating: amount = Gcal × rate, entered per month (varies), not a flat plateau.
export const HEATING_RATE_PER_GCAL = 1654.41;
// The heating contract is a fixed-type tariff, so its row still needs a single nominal amount.
// Actual monthly bills vary around this ≈1 Gcal reference — realistic: the tariff is a hint.
export const HEATING_NOMINAL_AMOUNT = "1654.41";

// Cottage electricity is billed only when the monthly delta clears this threshold; dead-of-winter
// months stay reading-only (a genuine gap in the ledger).
export const COTTAGE_BILL_THRESHOLD = 5;

// --- Seasonal baselines (absolute units, index 0 = January … 11 = December) ---
// Tuned to the profile targets: ≈50 m², 2 people, Kyiv.

const SEED_CONSUMPTION_PROFILES: Record<TSeedSeries, readonly number[]> = {
  // Apartment electricity, split day/night (~63% / ~37% of a 150–260 kWh total).
  [SEED_SERIES.APT_ELECTRICITY_DAY]: [160, 155, 140, 120, 110, 105, 105, 110, 120, 140, 155, 165],
  [SEED_SERIES.APT_ELECTRICITY_NIGHT]: [94, 91, 82, 71, 65, 62, 62, 65, 71, 82, 91, 97],
  // Apartment gas (cooking) — mild, 7–13 m³.
  [SEED_SERIES.APT_GAS]: [13, 12, 11, 9, 8, 7, 7, 7, 8, 10, 12, 13],
  // Apartment cold water, split across two risers. Baselines sum to the single-meter concept
  // target [5.0, 4.8, 5.1, 4.9, 5.2, 5.3, 5.4, 5.2, 5.0, 4.9, 5.0, 5.1] the service had before.
  // Kitchen riser — the lighter of the two (~1.5–1.7 m³).
  [SEED_SERIES.APT_COLD_WATER_KITCHEN]: [
    1.6, 1.5, 1.6, 1.5, 1.6, 1.7, 1.7, 1.6, 1.6, 1.5, 1.6, 1.6,
  ],
  // Bathroom riser — the heavier (~3.3–3.7 m³).
  [SEED_SERIES.APT_COLD_WATER_BATH]: [3.4, 3.3, 3.5, 3.4, 3.6, 3.6, 3.7, 3.6, 3.4, 3.4, 3.4, 3.5],
  // Apartment hot water — July (idx 6) near-zero: summer maintenance outage.
  [SEED_SERIES.APT_HOT_WATER]: [3.4, 3.3, 3.2, 3.0, 2.8, 2.6, 0.2, 2.6, 2.9, 3.1, 3.3, 3.5],
  // House electricity — higher base, mild winter bump.
  [SEED_SERIES.HOUSE_ELECTRICITY]: [420, 410, 390, 360, 340, 330, 330, 340, 360, 390, 410, 430],
  // House gas — strong heating seasonality: near-zero summer, large winter peaks (× severity).
  [SEED_SERIES.HOUSE_GAS]: [300, 270, 200, 90, 25, 10, 8, 10, 30, 110, 220, 300],
  // House cold water — flat, slightly above the apartment.
  [SEED_SERIES.HOUSE_COLD_WATER]: [6.0, 5.8, 6.1, 5.9, 6.2, 6.3, 6.4, 6.2, 6.0, 5.9, 6.0, 6.1],
  // Cottage electricity — summer-dominant; winter sits below COTTAGE_BILL_THRESHOLD (reading-only).
  [SEED_SERIES.COTTAGE_ELECTRICITY]: [2, 2, 4, 20, 36, 42, 42, 38, 24, 8, 2, 2],
};

// Heating Gcal per calendar month: zero outside mid-Oct…mid-Apr, shoulder months low, Dec–Feb peaks.
const HEATING_GCAL_BY_MONTH: readonly number[] = [
  1.35, 1.25, 0.82, 0.42, 0, 0, 0, 0, 0, 0.4, 0.72, 1.3,
];

// --- Deterministic noise & severity ---

// Integer avalanche (the murmur3-style fmix32 finalizer). hashString alone is nearly linear in the
// last character, so keys that differ by one digit — "winter:2025" vs "winter:2026", or adjacent
// months ":0" vs ":1" — would map to almost-identical hashes. Mixing diffuses every input bit, so
// consecutive years/months produce well-separated, independent values.
const mix32 = (input: number): number => {
  let h = input >>> 0;
  h ^= h >>> 16;
  h = Math.imul(h, 0x45d9f3b) >>> 0;
  h ^= h >>> 16;
  h = Math.imul(h, 0x45d9f3b) >>> 0;
  h ^= h >>> 16;

  return h >>> 0;
};

// A key → float in [0, 1): hash, avalanche, then normalize by 2^32.
const unitFloat = (key: string): number => mix32(hashString(key)) / 0x1_0000_0000;

// ±4% multiplicative jitter, stable per (series, year, month).
const JITTER_AMPLITUDE = 0.08;
const jitter = (seriesKey: string, year: number, month: number): number =>
  1 + (unitFloat(`${seriesKey}:${year}:${month}`) - 0.5) * JITTER_AMPLITUDE;

// Heating season = mid-Oct…mid-Apr, at month granularity Oct(9)…Apr(3).
const isHeatingMonth = (month: number): boolean => month >= 9 || month <= 3;

// Series whose heating-month consumption swings with the winter's severity.
const SEVERITY_SENSITIVE_SERIES: ReadonlySet<TSeedSeries> = new Set([SEED_SERIES.HOUSE_GAS]);

// A winter is anchored by the calendar year of its January (Oct 2024 … Apr 2025 → anchor 2025),
// so both winters in any window get their own stable severity. Only meaningful in heating months.
const anchorYear = (year: number, month: number): number => (month >= 9 ? year + 1 : year);

// Severity in [0.90, 1.10), keyed to the winter's anchor year — so successive winters differ in
// shape (each is stable across runs, and it slides correctly as the window advances over years).
export const winterSeverity = (anchor: number): number => 0.9 + unitFloat(`winter:${anchor}`) * 0.2;

// --- Public generation functions ---

// Monthly consumption for a metered series, keyed to the calendar (year, month).
export const monthlyConsumption = (series: TSeedSeries, year: number, month: number): number => {
  const base = SEED_CONSUMPTION_PROFILES[series][month]!;
  const severity =
    SEVERITY_SENSITIVE_SERIES.has(series) && isHeatingMonth(month)
      ? winterSeverity(anchorYear(year, month))
      : 1;

  return base * severity * jitter(series, year, month);
};

// Monthly heating quantity in Gcal (0 outside the heating season); amount = Gcal × rate downstream.
export const heatingGcal = (year: number, month: number): number => {
  const base = HEATING_GCAL_BY_MONTH[month]!;
  if (base === 0) return 0;

  return base * winterSeverity(anchorYear(year, month)) * jitter(HEATING_JITTER_KEY, year, month);
};

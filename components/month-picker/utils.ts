import { capitalize } from "@/lib/utils/capitalize";

const MONTHS_IN_YEAR = 12;
const LABEL_REFERENCE_YEAR = 2000;

// A month value is the ISO "YYYY-MM" string. Zero-padding makes lexicographic
// string comparison equivalent to chronological comparison, so min/max checks
// are plain `<`/`>` on the strings.

export type TYearMonth = { year: number; month: number }; // month is 1–12

export const parseYearMonth = (value: string): TYearMonth => {
  const [year, month] = value.split("-");

  return { year: Number(year), month: Number(month) };
};

export const toYearMonth = (year: number, month: number): string =>
  `${year}-${String(month).padStart(2, "0")}`;

export const currentYearMonth = (): string => {
  const now = new Date();
  return toYearMonth(now.getUTCFullYear(), now.getUTCMonth() + 1);
};

export const formatMonthLabel = (value: string, locale: string): string => {
  const { year, month } = parseYearMonth(value);

  return capitalize(
    new Intl.DateTimeFormat(locale, {
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }).format(Date.UTC(year, month - 1, 1)),
  );
};

export const getMonthShortLabels = (locale: string): string[] => {
  const format = new Intl.DateTimeFormat(locale, { month: "short", timeZone: "UTC" });

  return Array.from({ length: MONTHS_IN_YEAR }, (_, index) =>
    format.format(Date.UTC(LABEL_REFERENCE_YEAR, index, 1)),
  );
};

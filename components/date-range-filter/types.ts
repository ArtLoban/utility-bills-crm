export const TIME_PERIODS = {
  THIS_MONTH: "thisMonth",
  LAST_MONTH: "lastMonth",
  THIS_YEAR: "thisYear",
  LAST_6_MONTHS: "last6Months",
  LAST_12_MONTHS: "last12Months",
} as const;

export type TTimePeriod = (typeof TIME_PERIODS)[keyof typeof TIME_PERIODS];

export type TDateRangeOrientation = "inline" | "stacked";

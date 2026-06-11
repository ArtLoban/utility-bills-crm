export const TIME_PERIOD = {
  THIS_MONTH: "thisMonth",
  LAST_MONTH: "lastMonth",
  THIS_YEAR: "thisYear",
  LAST_6_MONTHS: "last6Months",
  LAST_12_MONTHS: "last12Months",
} as const;

export type TTimePeriod = (typeof TIME_PERIOD)[keyof typeof TIME_PERIOD];

export type TPreset = {
  id: TTimePeriod;
  label: string;
};

// inline — desktop filter chips in a row; stacked — labeled vertical fields for a mobile sheet.
export type TDateRangeOrientation = "inline" | "stacked";

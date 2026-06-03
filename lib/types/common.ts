export type TStringOrNull = string | null;

export const DATE_PARAMS = {
  DATE_FROM: "dateFrom",
  DATE_TO: "dateTo",
} as const;

export type TDateParam = (typeof DATE_PARAMS)[keyof typeof DATE_PARAMS];

export type TDateParams = {
  [DATE_PARAMS.DATE_FROM]?: TStringOrNull;
  [DATE_PARAMS.DATE_TO]?: TStringOrNull;
};

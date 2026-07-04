import type { TServiceTypeCode } from "./service-type";

export type TServiceTypeTranslator = ((code: TServiceTypeCode) => string) & {
  has: (code: TServiceTypeCode) => boolean;
};

export type TServiceLabelInput = {
  name: string | null;
  code: TServiceTypeCode;
};

export const resolveServiceTypeLabel = (
  code: TServiceTypeCode,
  t: TServiceTypeTranslator,
): string => (t.has(code) ? t(code) : code);

export const resolveServiceLabel = (
  { name, code }: TServiceLabelInput,
  t: TServiceTypeTranslator,
): string => name ?? resolveServiceTypeLabel(code, t);

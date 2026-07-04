import {
  resolveServiceLabel,
  resolveServiceTypeLabel,
  type TServiceTypeTranslator,
} from "./service-label";
import type { TServiceTypeCode } from "./service-type";

export type TServicePickerSource = {
  id: string;
  name: string | null;
  typeCode: TServiceTypeCode;
  providerName: string | null;
  accountNumber: string | null;
};

export type TServicePickerOption = {
  id: string;
  name: string;
  secondary?: string;
};

export const buildServicePickerOptions = (
  sources: TServicePickerSource[],
  t: TServiceTypeTranslator,
): TServicePickerOption[] => {
  const labels = sources.map((source) =>
    resolveServiceLabel({ name: source.name, code: source.typeCode }, t),
  );

  const labelCounts = new Map<string, number>();
  for (const label of labels) labelCounts.set(label, (labelCounts.get(label) ?? 0) + 1);

  return sources.map((source, index) => {
    const label = labels[index]!;

    if ((labelCounts.get(label) ?? 0) === 1)
      return {
        id: source.id,
        name: label,
      };

    const secondary =
      source.providerName ?? source.accountNumber ?? resolveServiceTypeLabel(source.typeCode, t);

    return {
      id: source.id,
      name: label,
      secondary,
    };
  });
};

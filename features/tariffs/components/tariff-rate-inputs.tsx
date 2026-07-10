"use client";

import { useTranslations } from "next-intl";
import type { Control, FieldPath, FieldValues } from "react-hook-form";

import { FormTextField } from "@/components/form/form-text-field";
import { cn } from "@/lib/utils";
import { UNIT_LABELS, ZONE_COLOR_VARS, zoneLabelKeys } from "@/lib/constants/zones";
import type { TServiceTypeUnit } from "@/lib/db/schema/service-types";

const gridColsFor = (zoneCount: number): string =>
  zoneCount >= 3
    ? "grid-cols-1 sm:grid-cols-3"
    : zoneCount === 2
      ? "grid-cols-1 sm:grid-cols-2"
      : "grid-cols-1";

type TProps<T extends FieldValues> = {
  control: Control<T>;
  names: readonly [FieldPath<T>, FieldPath<T>, FieldPath<T>];
  zoneCount: number;
  unit: TServiceTypeUnit | null;
};

export const TariffRateInputs = <T extends FieldValues>({
  control,
  names,
  zoneCount,
  unit,
}: TProps<T>) => {
  const tZones = useTranslations("zones");
  const tTariffs = useTranslations("tariffs");
  const labelKeys = zoneLabelKeys(zoneCount);
  const adornment = unit ? tTariffs("perUnit", { unit: UNIT_LABELS[unit] }) : undefined;

  return (
    <div className={cn("grid gap-2.5", gridColsFor(zoneCount))}>
      {names.slice(0, zoneCount).map((name, i) => {
        const color = ZONE_COLOR_VARS[i] ?? ZONE_COLOR_VARS[0];

        return (
          <FormTextField
            key={name}
            control={control}
            name={name}
            type="number"
            inputMode="decimal"
            step="0.0001"
            placeholder="0.00"
            label={tZones((labelKeys[i] ?? "single") as Parameters<typeof tZones>[0])}
            adornment={adornment}
            inputClassName="tabular-nums"
            inputStyle={{
              borderColor: `color-mix(in srgb, ${color} 50%, transparent)`,
              background: `color-mix(in srgb, ${color} 5%, transparent)`,
            }}
            labelClassName="text-muted-foreground text-xs font-medium"
          />
        );
      })}
    </div>
  );
};

"use client";

import { useTranslations } from "next-intl";
import type { Control } from "react-hook-form";

import { FormTextField } from "@/components/form/form-text-field";
import { cn } from "@/lib/utils";
import { ZONE_LABELS } from "../constants";
import { ServiceSetupFormField } from "../schema";
import type { TServiceSetupForm } from "../schema";

const RATE_FIELDS = [
  ServiceSetupFormField.RATE_T1,
  ServiceSetupFormField.RATE_T2,
  ServiceSetupFormField.RATE_T3,
] as const;

const ZONE_GRID_COLS: Record<1 | 2 | 3, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-3",
};

type TProps = {
  control: Control<TServiceSetupForm>;
  effectiveZoneCount: 1 | 2 | 3;
  supportsZones: boolean;
};

export const RateInputs = ({ control, effectiveZoneCount, supportsZones }: TProps) => {
  const t = useTranslations("services.serviceForm");

  const rateFields = RATE_FIELDS.slice(0, effectiveZoneCount);
  const zoneLabels = ZONE_LABELS[effectiveZoneCount];
  const isMultiZone = effectiveZoneCount > 1;

  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-sm font-medium">
        {isMultiZone ? t("fields.rates.label") : t("fields.rate.label")}
      </p>
      <div className={cn("grid gap-2.5", ZONE_GRID_COLS[effectiveZoneCount])}>
        {rateFields.map((name, index) => (
          <FormTextField
            key={name}
            control={control}
            name={name}
            type="number"
            inputMode="decimal"
            step="0.0001"
            min="0"
            placeholder="0.00"
            label={
              isMultiZone
                ? t(`zoneLabels.${zoneLabels[index]}` as Parameters<typeof t>[0])
                : undefined
            }
            labelClassName="text-muted-foreground text-xs tracking-wide uppercase"
          />
        ))}
      </div>
      {supportsZones ? (
        <p className="text-muted-foreground text-sm">
          {isMultiZone ? t("hint.multiZone") : t("hint.singleZone")}
        </p>
      ) : null}
    </div>
  );
};

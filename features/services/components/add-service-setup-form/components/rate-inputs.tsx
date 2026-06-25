"use client";

import { useTranslations } from "next-intl";
import type { Control } from "react-hook-form";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ZONE_LABELS } from "../constants";
import { ServiceSetupFormField } from "../schema";
import type { TServiceSetupForm } from "../schema";

const RATE_FIELDS = [
  ServiceSetupFormField.RATE_T1,
  ServiceSetupFormField.RATE_T2,
  ServiceSetupFormField.RATE_T3,
] as const;

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
      <div
        className="grid gap-2.5"
        style={{ gridTemplateColumns: `repeat(${effectiveZoneCount}, 1fr)` }}
      >
        {rateFields.map((name, index) => (
          <FormField
            key={name}
            control={control}
            name={name}
            render={({ field }) => (
              <FormItem>
                {isMultiZone ? (
                  <FormLabel className="text-muted-foreground text-[11px] tracking-wide uppercase">
                    {t(`zoneLabels.${zoneLabels[index]}` as Parameters<typeof t>[0])}
                  </FormLabel>
                ) : null}
                <FormControl>
                  <Input placeholder="0.00" {...field} />
                </FormControl>
                {index === 0 ? <FormMessage /> : null}
              </FormItem>
            )}
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

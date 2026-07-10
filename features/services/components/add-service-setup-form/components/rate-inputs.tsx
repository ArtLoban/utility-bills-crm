"use client";

import { useTranslations } from "next-intl";
import type { Control } from "react-hook-form";

import { TariffRateInputs } from "@/features/tariffs/components/tariff-rate-inputs";
import type { TZoneCount } from "@/lib/constants/zones";
import type { TServiceTypeUnit } from "@/lib/db/schema/service-types";
import { ServiceSetupFormField } from "../schema";
import type { TServiceSetupForm } from "../schema";

const RATE_NAMES = [
  ServiceSetupFormField.RATE_T1,
  ServiceSetupFormField.RATE_T2,
  ServiceSetupFormField.RATE_T3,
] as const;

type TProps = {
  control: Control<TServiceSetupForm>;
  effectiveZoneCount: TZoneCount;
  supportsZones: boolean;
  unit: TServiceTypeUnit | null;
};

export const RateInputs = ({ control, effectiveZoneCount, supportsZones, unit }: TProps) => {
  const t = useTranslations("services.serviceForm");
  const isMultiZone = effectiveZoneCount > 1;

  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-sm font-medium">
        {isMultiZone ? t("fields.rates.label") : t("fields.rate.label")}
      </p>
      <TariffRateInputs
        control={control}
        names={RATE_NAMES}
        zoneCount={effectiveZoneCount}
        unit={unit}
      />
      {supportsZones ? (
        <p className="text-muted-foreground text-sm">
          {isMultiZone ? t("hint.multiZone") : t("hint.singleZone")}
        </p>
      ) : null}
    </div>
  );
};

"use client";

import { useTranslations } from "next-intl";
import type { Control } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { FormDateField } from "@/components/form/form-date-field";
import { FormTextField } from "@/components/form/form-text-field";
import { TARIFF_LIMITS } from "@/features/tariffs/schema";
import type { TServiceType } from "@/lib/db/schema/service-types";
import { ServiceSetupFormField } from "../schema";
import type { TServiceSetupForm } from "../schema";
import { RateInputs } from "./rate-inputs";
import { FixedAmountInput } from "./fixed-amount-input";

type TProps = {
  control: Control<TServiceSetupForm>;
  selectedType: TServiceType | null;
  effectiveZoneCount: 1 | 2 | 3;
};

export const TariffSection = ({ control, selectedType, effectiveZoneCount }: TProps) => {
  const t = useTranslations("services.serviceForm");

  const measurementType = selectedType?.measurementType;
  const supportsZones = selectedType?.supportsZones ?? false;

  return (
    <div className="flex flex-col gap-4">
      {measurementType === "metered" ? (
        <RateInputs
          control={control}
          effectiveZoneCount={effectiveZoneCount}
          supportsZones={supportsZones}
        />
      ) : measurementType === "fixed" ? (
        <FixedAmountInput control={control} />
      ) : (
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground text-sm font-medium">{t("fields.rate.label")}</p>
          <Input placeholder="0.00" disabled />
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <FormDateField
          control={control}
          name={ServiceSetupFormField.TARIFF_VALID_FROM}
          label={t("fields.tariffValidFrom.label")}
          required
        />

        <FormTextField
          control={control}
          name={ServiceSetupFormField.TARIFF_NOTES}
          label={t("fields.tariffNotes.label")}
          placeholder={t("fields.tariffNotes.placeholder")}
          maxLength={TARIFF_LIMITS.notes}
        />
      </div>
    </div>
  );
};

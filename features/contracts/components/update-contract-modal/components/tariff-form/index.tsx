"use client";

import { useTranslations } from "next-intl";
import { type UseFormReturn, useWatch } from "react-hook-form";

import { Form } from "@/components/ui/form";
import { FormFields } from "@/components/form/form-fields";
import { FormDateField } from "@/components/form/form-date-field";
import { FormTextField } from "@/components/form/form-text-field";
import { FormTextareaField } from "@/components/form/form-textarea-field";
import { TariffRateInputs } from "@/features/tariffs/components/tariff-rate-inputs";
import { TARIFF_LIMITS, type TChangeTariffForm } from "@/features/tariffs/schema";
import type { TServiceType } from "@/lib/db/schema/service-types";
import { UPDATE_CONTRACT_NAMESPACE } from "../../constants";
import { TariffFormField } from "../../types";
import { ChangeCallout } from "../change-callout";

type TProps = {
  form: UseFormReturn<TChangeTariffForm>;
  serviceType: TServiceType;
  zoneCount: number;
};

const RATE_NAMES = [
  TariffFormField.RATE_T1,
  TariffFormField.RATE_T2,
  TariffFormField.RATE_T3,
] as const;

export const TariffForm = ({ form, serviceType, zoneCount }: TProps) => {
  const t = useTranslations(UPDATE_CONTRACT_NAMESPACE);
  const tRates = useTranslations("tariffs");
  const { control, formState } = form;
  const rootError = formState.errors.root?.message;

  const changeDate = useWatch({ control, name: TariffFormField.CHANGE_DATE });
  const { measurementType, unit } = serviceType;
  const isMetered = measurementType === "metered";

  return (
    <Form {...form}>
      <FormFields>
        <FormDateField
          control={control}
          name={TariffFormField.CHANGE_DATE}
          label={t("fields.effectiveFrom")}
          required
        />

        {isMetered ? (
          <div className="flex flex-col gap-1.5">
            <span className="text-muted-foreground text-sm font-medium">
              {t("fields.newRates")}
            </span>
            <TariffRateInputs
              control={control}
              names={RATE_NAMES}
              zoneCount={zoneCount}
              unit={unit}
            />
          </div>
        ) : (
          <FormTextField
            control={control}
            name={TariffFormField.FIXED_AMOUNT}
            label={t("fields.monthlyAmount")}
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            adornment={tRates("perMonth")}
            inputClassName="tabular-nums"
            className="max-w-40"
          />
        )}

        <FormTextareaField
          control={control}
          name={TariffFormField.NOTES}
          label={t("fields.notesOptional")}
          maxLength={TARIFF_LIMITS.notes}
          rows={2}
        />

        <ChangeCallout changeDate={changeDate} messageKey="callout.tariff" />

        {rootError ? <p className="text-destructive text-sm">{rootError}</p> : null}
      </FormFields>
    </Form>
  );
};

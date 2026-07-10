"use client";

import { useTranslations } from "next-intl";
import { type UseFormReturn, useWatch } from "react-hook-form";

import { Form } from "@/components/ui/form";
import { FormFields } from "@/components/form/form-fields";
import { FormDateField } from "@/components/form/form-date-field";
import { FormTextField } from "@/components/form/form-text-field";
import { FormTextareaField } from "@/components/form/form-textarea-field";
import { cn } from "@/lib/utils";
import { UNIT_LABELS, ZONE_COLOR_VARS } from "@/lib/constants/zones";
import { TARIFF_LIMITS, type TChangeTariffForm } from "@/features/tariffs/schema";
import type { TServiceType } from "@/lib/db/schema/service-types";
import { UPDATE_CONTRACT_NAMESPACE } from "../../constants";
import { TariffFormField } from "../../types";
import { ChangeCallout } from "../change-callout";
import { RateField } from "./rate-field";

type TProps = {
  form: UseFormReturn<TChangeTariffForm>;
  serviceType: TServiceType;
};

const RATE_FIELDS = [
  { name: TariffFormField.RATE_T1, color: ZONE_COLOR_VARS[0], labelKey: "fields.t1" },
  { name: TariffFormField.RATE_T2, color: ZONE_COLOR_VARS[1], labelKey: "fields.t2" },
  { name: TariffFormField.RATE_T3, color: ZONE_COLOR_VARS[2], labelKey: "fields.t3" },
] as const;

export const TariffForm = ({ form, serviceType }: TProps) => {
  const t = useTranslations(UPDATE_CONTRACT_NAMESPACE);
  const tRates = useTranslations("services.detail.contract.rates");
  const { control, formState } = form;
  const rootError = formState.errors.root?.message;

  const changeDate = useWatch({ control, name: TariffFormField.CHANGE_DATE });
  const { measurementType, unit, supportsZones } = serviceType;
  const isMetered = measurementType === "metered";
  const unitLabel = unit ? UNIT_LABELS[unit] : "";
  const perUnit = tRates("perUnit", { unit: unitLabel });
  const rates = supportsZones ? RATE_FIELDS : RATE_FIELDS.slice(0, 1);

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
            <div
              className={cn(
                "grid gap-3",
                supportsZones ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-1",
              )}
            >
              {rates.map(({ name, color, labelKey }) => (
                <RateField
                  key={name}
                  control={control}
                  name={name}
                  color={color}
                  label={t(labelKey)}
                  adornment={perUnit}
                />
              ))}
            </div>
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

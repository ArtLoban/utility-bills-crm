"use client";

import { useTranslations } from "next-intl";
import { type UseFormReturn, useWatch } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FormFields } from "@/components/form/form-fields";
import { FormDateField } from "@/components/form/form-date-field";
import { FormTextareaField } from "@/components/form/form-textarea-field";
import { Input } from "@/components/ui/input";
import { UNIT_LABELS, ZONE_COLOR_VARS } from "@/lib/constants/zones";
import { TARIFF_LIMITS, type TChangeTariffForm } from "@/features/tariffs/schema";
import type { TServiceType } from "@/lib/db/schema/service-types";
import { UPDATE_CONTRACT_NAMESPACE } from "../constants";
import { TariffFormField } from "../types";
import { ChangeCallout } from "./change-callout";

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
  const isMetered = serviceType.measurementType === "metered";
  const unitLabel = serviceType.unit ? UNIT_LABELS[serviceType.unit] : "";
  const perUnit = tRates("perUnit", { unit: unitLabel });
  const rates = serviceType.supportsZones ? RATE_FIELDS : RATE_FIELDS.slice(0, 1);

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
            <div className="grid grid-cols-2 gap-3">
              {rates.map(({ name, color, labelKey }) => (
                <FormField
                  key={name}
                  control={control}
                  name={name}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground text-xs font-medium">
                        {t(labelKey)}
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            value={field.value ?? ""}
                            type="number"
                            step="0.0001"
                            min="0"
                            placeholder="0.0000"
                            className="pr-12 tabular-nums"
                            style={{
                              borderColor: `color-mix(in srgb, ${color} 50%, transparent)`,
                              background: `color-mix(in srgb, ${color} 5%, transparent)`,
                            }}
                          />
                          <span className="text-muted-foreground pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-xs">
                            {perUnit}
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </div>
        ) : (
          <FormField
            control={control}
            name={TariffFormField.FIXED_AMOUNT}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("fields.monthlyAmount")}</FormLabel>
                <FormControl>
                  <div className="relative max-w-40">
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      className="pr-12 tabular-nums"
                    />
                    <span className="text-muted-foreground pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-xs">
                      {tRates("perMonth")}
                    </span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
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

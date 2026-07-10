"use client";

import { useTranslations } from "next-intl";
import { type UseFormReturn } from "react-hook-form";

import { Form } from "@/components/ui/form";
import { FormFields } from "@/components/form/form-fields";
import { FormDateField } from "@/components/form/form-date-field";
import { FormTextField } from "@/components/form/form-text-field";
import { FormSelectField } from "@/components/form/form-select-field";
import { FormTextareaField } from "@/components/form/form-textarea-field";
import { toIsoDate } from "@/lib/format/date";
import { METER_LIMITS, type TReplaceMeterFormValues } from "@/features/meters/schema";
import { ReplaceMeterFormField } from "@/features/meters/types";
import { ZONE_COUNT_VALUES, zoneSummaryKey } from "@/lib/constants/zones";
import type { TMeter } from "@/lib/db/schema/meters";

import { ReplacementInfo } from "./components/replacement-info";

type TProps = {
  form: UseFormReturn<TReplaceMeterFormValues>;
  meter: TMeter;
  supportsZones: boolean;
};

export const ReplaceMeterForm = ({ form, meter, supportsZones }: TProps) => {
  const t = useTranslations("meters.replaceForm");
  const tZones = useTranslations("zones");
  const { control, formState } = form;
  const rootError = formState.errors.root?.message;

  const zoneOptions = ZONE_COUNT_VALUES.map((value) => ({
    id: value,
    name: tZones(zoneSummaryKey(Number(value)) as Parameters<typeof tZones>[0]),
  }));

  return (
    <Form {...form}>
      <FormFields>
        <FormDateField
          control={control}
          name={ReplaceMeterFormField.REPLACEMENT_DATE}
          label={t("fields.replacementDate.label")}
          description={t("fields.replacementDate.hint")}
          min={toIsoDate(meter.validFrom)}
          required
        />

        <div className="flex items-center gap-2.5">
          <hr className="border-border flex-1" />
          <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            {t("newMeterDivider")}
          </span>
          <hr className="border-border flex-1" />
        </div>

        <FormTextField
          control={control}
          name={ReplaceMeterFormField.SERIAL_NUMBER}
          label={t("fields.serialNumber.label")}
          placeholder={t("fields.serialNumber.placeholder")}
          maxLength={METER_LIMITS.serialNumber}
        />

        {supportsZones ? (
          <FormSelectField
            control={control}
            name={ReplaceMeterFormField.ZONE_COUNT}
            label={t("fields.zoneCount.label")}
            options={zoneOptions}
            required
          />
        ) : null}

        <FormDateField
          control={control}
          name={ReplaceMeterFormField.INSTALLED_AT}
          label={t("fields.installedAt.label")}
        />

        <FormTextareaField
          control={control}
          name={ReplaceMeterFormField.NOTES}
          label={t("fields.notes.label")}
          placeholder={t("fields.notes.placeholder")}
          maxLength={METER_LIMITS.notes}
          rows={3}
        />

        <ReplacementInfo />

        {rootError ? <p className="text-destructive text-sm">{rootError}</p> : null}
      </FormFields>
    </Form>
  );
};

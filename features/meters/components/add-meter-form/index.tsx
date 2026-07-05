"use client";

import { useTranslations } from "next-intl";
import { type UseFormReturn } from "react-hook-form";

import { Form } from "@/components/ui/form";
import { FormFields } from "@/components/form/form-fields";
import { FormDateField } from "@/components/form/form-date-field";
import { FormTextField } from "@/components/form/form-text-field";
import { FormSelectField } from "@/components/form/form-select-field";
import { FormTextareaField } from "@/components/form/form-textarea-field";
import { METER_LIMITS, type TCreateMeterFormValues } from "@/features/meters/schema";
import { ZONE_COUNT_OPTIONS } from "@/features/meters/constants";
import { CreateMeterFormField } from "@/features/meters/types";
import type { TEligibleMeterService } from "@/features/meters/types";
import { type TServiceTypeCode } from "@/features/services/service-type";
import { resolveServiceLabel, resolveServiceTypeLabel } from "@/features/services/service-label";
import type { TServiceType } from "@/lib/db/schema/service-types";

import { ServiceSelectField } from "./components/service-select-field";

type TProps = {
  form: UseFormReturn<TCreateMeterFormValues>;
  availableServiceTypes: TServiceType[];
  servicesOfType: TEligibleMeterService[];
  supportsZones: boolean;
};

export const AddMeterForm = ({
  form,
  availableServiceTypes,
  servicesOfType,
  supportsZones,
}: TProps) => {
  const t = useTranslations("meters.addForm");
  const tTypes = useTranslations("services.types");
  const tZone = useTranslations("meters.detail.details.zoneCount");
  const { control, formState } = form;
  const rootError = formState.errors.root?.message;

  if (availableServiceTypes.length === 0) {
    return <p className="text-muted-foreground text-sm">{t("empty")}</p>;
  }

  const serviceOptions = availableServiceTypes.map((st) => ({
    id: st.id,
    name: resolveServiceTypeLabel(st.code as TServiceTypeCode, tTypes),
  }));

  const serviceLineOptions = servicesOfType.map((s) => ({
    id: s.id,
    label: resolveServiceLabel({ name: s.name, code: s.code as TServiceTypeCode }, tTypes),
  }));

  const zoneOptions = ZONE_COUNT_OPTIONS.map(({ value, labelKey }) => ({
    id: value,
    name: tZone(labelKey),
  }));

  return (
    <Form {...form}>
      <FormFields>
        <FormSelectField
          control={control}
          name={CreateMeterFormField.SERVICE_TYPE_ID}
          label={t("fields.serviceType.label")}
          description={t("fields.serviceType.hint")}
          placeholder={t("fields.serviceType.placeholder")}
          options={serviceOptions}
          required
        />

        {serviceLineOptions.length > 0 ? (
          <ServiceSelectField
            control={control}
            label={t("fields.services.label")}
            description={t("fields.services.hint")}
            options={serviceLineOptions}
          />
        ) : null}

        <FormTextField
          control={control}
          name={CreateMeterFormField.SERIAL_NUMBER}
          label={t("fields.serialNumber.label")}
          placeholder={t("fields.serialNumber.placeholder")}
          maxLength={METER_LIMITS.serialNumber}
        />

        {supportsZones ? (
          <FormSelectField
            control={control}
            name={CreateMeterFormField.ZONE_COUNT}
            label={t("fields.zoneCount.label")}
            options={zoneOptions}
            required
          />
        ) : null}

        <FormDateField
          control={control}
          name={CreateMeterFormField.INSTALLED_AT}
          label={t("fields.installedAt.label")}
        />

        <FormDateField
          control={control}
          name={CreateMeterFormField.VALID_FROM}
          label={t("fields.validFrom.label")}
          description={t("fields.validFrom.hint")}
          required
        />

        <FormTextareaField
          control={control}
          name={CreateMeterFormField.NOTES}
          label={t("fields.notes.label")}
          placeholder={t("fields.notes.placeholder")}
          maxLength={METER_LIMITS.notes}
          rows={3}
        />

        {rootError ? <p className="text-destructive text-sm">{rootError}</p> : null}
      </FormFields>
    </Form>
  );
};

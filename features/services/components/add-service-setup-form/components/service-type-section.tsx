"use client";

import { useTranslations } from "next-intl";
import type { Control } from "react-hook-form";

import { FormField, FormItem, FormMessage } from "@/components/ui/form";
import { FormTextField } from "@/components/form/form-text-field";
import { FormTextareaField } from "@/components/form/form-textarea-field";
import { InfoBanner } from "@/components/info-banner";
import {
  getServiceTypeVisuals,
  SERVICE_TYPE_CODES,
  type TServiceTypeCode,
} from "@/features/services/service-type";
import { resolveServiceTypeLabel } from "@/features/services/service-label";
import type { TServiceType } from "@/lib/db/schema/service-types";
import { SERVICE_LIMITS } from "@/features/services/schema";
import { ServiceSetupFormField } from "../schema";
import type { TServiceSetupForm } from "../schema";
import type { TServiceTypeOption } from "../types";
import { ServiceTypeSelector } from "./service-type-selector";

type TProps = {
  control: Control<TServiceSetupForm>;
  serviceTypes: TServiceType[];
  existingTypeIds: TServiceType["id"][];
  nameRequired: boolean;
  duplicateTypeLabel: string | null;
  onDismissDuplicateWarning: () => void;
};

export const ServiceTypeSection = ({
  control,
  serviceTypes,
  existingTypeIds,
  nameRequired,
  duplicateTypeLabel,
  onDismissDuplicateWarning,
}: TProps) => {
  const t = useTranslations("services");
  const tTypes = useTranslations("services.types");

  const getMeasurementLabel = (serviceType: TServiceType): string => {
    if (serviceType.measurementType === "fixed") return t("serviceForm.measurement.fixed");
    if (serviceType.supportsZones) return t("serviceForm.measurement.meteredZones");

    return t("serviceForm.measurement.metered");
  };

  const existingSet = new Set(existingTypeIds);
  const options: TServiceTypeOption[] = serviceTypes.map((serviceType) => {
    const { color, Icon } = getServiceTypeVisuals(serviceType.code as TServiceTypeCode);

    return {
      id: serviceType.id,
      label: resolveServiceTypeLabel(serviceType.code as TServiceTypeCode, tTypes),
      measurementLabel: getMeasurementLabel(serviceType),
      color,
      Icon,
      isAdded: existingSet.has(serviceType.id) && serviceType.code !== SERVICE_TYPE_CODES.OTHER,
    };
  });

  return (
    <div className="flex flex-col gap-4">
      <FormField
        control={control}
        name={ServiceSetupFormField.SERVICE_TYPE_ID}
        render={({ field }) => (
          <FormItem>
            <ServiceTypeSelector
              value={field.value}
              onChange={field.onChange}
              options={options}
              addedBadgeLabel={t("serviceForm.badge.added")}
              ariaLabel={t("serviceForm.sections.type.title")}
            />
            <FormMessage />
          </FormItem>
        )}
      />

      {duplicateTypeLabel ? (
        <InfoBanner
          text={t("serviceForm.warning.duplicateType", { type: duplicateTypeLabel })}
          onDismiss={onDismissDuplicateWarning}
          dismissLabel={t("serviceForm.warning.dismiss")}
        />
      ) : null}

      <FormTextField
        control={control}
        name={ServiceSetupFormField.NAME}
        label={t("serviceForm.fields.name.label")}
        placeholder={t("serviceForm.fields.name.placeholder")}
        description={t("serviceForm.fields.name.hint")}
        maxLength={SERVICE_LIMITS.name}
        required={nameRequired}
      />

      <FormTextareaField
        control={control}
        name={ServiceSetupFormField.SERVICE_NOTES}
        label={t("serviceForm.fields.serviceNotes.label")}
        placeholder={t("serviceForm.fields.serviceNotes.placeholder")}
        maxLength={SERVICE_LIMITS.notes}
        rows={3}
      />
    </div>
  );
};

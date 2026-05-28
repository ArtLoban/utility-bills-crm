"use client";

import { useTranslations } from "next-intl";
import { Controller } from "react-hook-form";

import { FormContainer } from "@/components/form-container";
import { FormField } from "@/components/form-field";
import { Textarea } from "@/components/ui/textarea";
import { getServiceTypeVisuals, type TServiceTypeCode } from "@/features/services/service-type";
import type { TServiceTypeId } from "@/lib/db/schema/service-types";
import type { TProps } from "./types";
import { useAddServiceSetup } from "./hooks/use-add-service-setup";
import { FormSection } from "./components/setup-section";
import { FormErrorBanner } from "./components/form-error-banner";
import { ServiceTypeSection } from "./components/service-type-section";
import { ContractSection } from "./components/contract-section";
import { TariffSection } from "./components/tariff-section";
import { MeterSection } from "./components/meter-section";

export const AddServiceSetupForm = ({
  propertyId,
  serviceTypes,
  existingTypeIds,
  providers,
}: TProps) => {
  const t = useTranslations("services.serviceForm");

  const {
    form,
    meterEngaged,
    setMeterEngaged,
    formError,
    isSaving,
    canSave,
    selectedType,
    isMetered,
    effectiveZoneCount,
    onSubmit,
  } = useAddServiceSetup({ propertyId, serviceTypes });

  const {
    control,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const selectedTypeId = watch("serviceTypeId");
  const isActive = selectedType !== null;

  const accentColor = selectedType
    ? getServiceTypeVisuals(selectedType.code as TServiceTypeCode).color
    : undefined;

  return (
    <FormContainer
      onSubmit={onSubmit}
      backHref={`/properties/${propertyId}`}
      submitText={t("submit")}
      isSaving={isSaving}
      canSave={canSave}
      size="md"
      noCard
    >
      <div className="flex flex-col gap-4 pb-2">
        {formError && <FormErrorBanner title={t("error.title")}>{formError}</FormErrorBanner>}

        <FormSection
          n={1}
          title={t("sections.type.title")}
          desc={t("sections.type.desc")}
          accent={accentColor}
        >
          <ServiceTypeSection
            serviceTypes={serviceTypes}
            existingTypeIds={existingTypeIds}
            selectedTypeId={selectedTypeId}
            onSelect={(id: TServiceTypeId) => setValue("serviceTypeId", id)}
          />
          <FormField label={t("fields.serviceNotes.label")} optional>
            <Controller
              name="serviceNotes"
              control={control}
              render={({ field }) => (
                <Textarea
                  placeholder={t("fields.serviceNotes.placeholder")}
                  rows={3}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                />
              )}
            />
          </FormField>
        </FormSection>

        <FormSection
          n={2}
          title={t("sections.contract.title")}
          desc={t("sections.contract.desc")}
          inactive={!isActive}
        >
          <ContractSection providers={providers} control={control} errors={errors} />
        </FormSection>

        <FormSection
          n={3}
          title={t("sections.tariff.title")}
          desc={t("sections.tariff.desc")}
          inactive={!isActive}
        >
          <TariffSection
            selectedType={selectedType}
            effectiveZoneCount={effectiveZoneCount}
            control={control}
            errors={errors}
          />
        </FormSection>

        {isMetered && (
          <FormSection
            n={4}
            title={t("sections.meter.title")}
            desc={t("sections.meter.desc")}
            inactive={!isActive}
          >
            <MeterSection
              selectedType={selectedType!}
              engaged={meterEngaged}
              onToggle={setMeterEngaged}
              control={control}
              errors={errors}
            />
          </FormSection>
        )}
      </div>
    </FormContainer>
  );
};

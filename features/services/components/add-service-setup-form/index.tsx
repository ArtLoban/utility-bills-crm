"use client";

import { useTranslations } from "next-intl";

import { Form } from "@/components/ui/form";
import { FormContainer } from "@/components/form-container";
import {
  getServiceTypeVisuals,
  SERVICE_TYPE_CODES,
  type TServiceTypeCode,
} from "@/features/services/service-type";
import { ROUTES } from "@/lib/routes";
import type { TProps } from "./types";
import { useAddServiceSetup } from "./hooks/use-add-service-setup";
import { FormSection } from "./components/form-section";
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
    isSaving,
    canSave,
    selectedType,
    isMetered,
    effectiveZoneCount,
    onSubmit,
  } = useAddServiceSetup({ propertyId, serviceTypes });

  const { control } = form;
  const rootError = form.formState.errors.root?.message;
  const isActive = selectedType !== null;
  const accentColor = selectedType
    ? getServiceTypeVisuals(selectedType.code as TServiceTypeCode).color
    : undefined;

  return (
    <Form {...form}>
      <FormContainer
        onSubmit={onSubmit}
        backHref={`${ROUTES.properties}/${propertyId}`}
        submitText={t("submit")}
        isSaving={isSaving}
        canSave={canSave}
        size="lg"
        noCard
      >
        <div className="flex flex-col gap-4 pb-2">
          {rootError ? (
            <FormErrorBanner title={t("error.title")}>{rootError}</FormErrorBanner>
          ) : null}

          <FormSection
            n={1}
            title={t("sections.type.title")}
            desc={t("sections.type.desc")}
            accent={accentColor}
          >
            <ServiceTypeSection
              control={control}
              serviceTypes={serviceTypes}
              existingTypeIds={existingTypeIds}
              nameRequired={selectedType?.code === SERVICE_TYPE_CODES.OTHER}
            />
          </FormSection>

          <FormSection
            n={2}
            title={t("sections.contract.title")}
            desc={t("sections.contract.desc")}
            inactive={!isActive}
          >
            <ContractSection control={control} providers={providers} />
          </FormSection>

          <FormSection
            n={3}
            title={t("sections.tariff.title")}
            desc={t("sections.tariff.desc")}
            inactive={!isActive}
          >
            <TariffSection
              control={control}
              selectedType={selectedType}
              effectiveZoneCount={effectiveZoneCount}
            />
          </FormSection>

          {isMetered && selectedType ? (
            <FormSection
              n={4}
              title={t("sections.meter.title")}
              desc={t("sections.meter.desc")}
              inactive={!isActive}
            >
              <MeterSection
                control={control}
                selectedType={selectedType}
                engaged={meterEngaged}
                onToggle={setMeterEngaged}
              />
            </FormSection>
          ) : null}
        </div>
      </FormContainer>
    </Form>
  );
};

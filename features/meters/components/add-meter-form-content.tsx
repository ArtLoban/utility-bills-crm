"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { FormContainer } from "@/components/form-container";
import { ROUTES } from "@/lib/routes";
import { useAddMeterForm } from "@/features/meters/hooks/use-add-meter-form";
import type { TEligibleMeterService } from "@/features/meters/types";
import type { TServiceType } from "@/lib/db/schema/service-types";

import { AddMeterForm } from "./add-meter-form";

type TProps = {
  propertyId: string;
  availableServiceTypes: TServiceType[];
  eligibleServices: TEligibleMeterService[];
};

export const AddMeterFormContent = ({
  propertyId,
  availableServiceTypes,
  eligibleServices,
}: TProps) => {
  const router = useRouter();
  const t = useTranslations("meters.addForm");
  const tForm = useTranslations("common.form");
  const onClose = () => router.back();

  const { form, handleSave, isSaving, supportsZones, servicesOfType } = useAddMeterForm({
    propertyId,
    availableServiceTypes,
    eligibleServices,
    onClose,
  });

  return (
    <FormContainer
      onSubmit={handleSave}
      backHref={`${ROUTES.properties}/${propertyId}?tab=meters`}
      submitText={t("actions.add")}
      cancelText={t("actions.cancel")}
      savingText={t("actions.adding")}
      footerText={tForm("syncNote")}
      size="sm"
      canSave={availableServiceTypes.length > 0}
      isSaving={isSaving}
    >
      <AddMeterForm
        form={form}
        availableServiceTypes={availableServiceTypes}
        servicesOfType={servicesOfType}
        supportsZones={supportsZones}
      />
    </FormContainer>
  );
};

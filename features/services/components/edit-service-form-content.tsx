"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { FormContainer } from "@/components/form-container";
import { ROUTES } from "@/lib/routes";
import { useEditService } from "@/features/services/hooks/use-edit-service";
import { EditServiceForm } from "./edit-service-form";
import type { PropertyId } from "@/lib/db/schema/properties";
import type { TServiceId } from "@/lib/db/schema/services";

type TProps = {
  propertyId: PropertyId;
  serviceId: TServiceId;
  initialNotes: string | null;
};

export const EditServiceFormContent = ({ propertyId, serviceId, initialNotes }: TProps) => {
  const router = useRouter();
  const t = useTranslations("services.editNotes");
  const tForm = useTranslations("common.form");
  const onClose = () => router.back();

  const { form, handleSave, isSaving } = useEditService({ serviceId, initialNotes, onClose });

  return (
    <FormContainer
      onSubmit={handleSave}
      backHref={`${ROUTES.properties}/${propertyId}/services/${serviceId}`}
      submitText={t("submit")}
      cancelText={t("cancel")}
      savingText={tForm("saving")}
      footerText={tForm("syncNote")}
      size="sm"
      isSaving={isSaving}
    >
      <EditServiceForm form={form} />
    </FormContainer>
  );
};

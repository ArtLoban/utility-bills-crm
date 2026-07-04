"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { FormContainer } from "@/components/form-container";
import { ROUTES } from "@/lib/routes";
import { useEditService } from "@/features/services/hooks/use-edit-service";
import type { TServiceTypeCode } from "@/features/services/service-type";
import { EditServiceForm } from "./edit-service-form";
import type { PropertyId } from "@/lib/db/schema/properties";
import type { TServiceId } from "@/lib/db/schema/services";

type TProps = {
  propertyId: PropertyId;
  serviceId: TServiceId;
  initialName: string | null;
  initialNotes: string | null;
  serviceTypeCode: TServiceTypeCode;
};

export const EditServiceFormContent = ({
  propertyId,
  serviceId,
  initialName,
  initialNotes,
  serviceTypeCode,
}: TProps) => {
  const router = useRouter();
  const t = useTranslations("services.editService");
  const tForm = useTranslations("common.form");
  const onClose = () => router.back();

  const { form, handleSave, isSaving, nameRequired } = useEditService({
    serviceId,
    initialName,
    initialNotes,
    serviceTypeCode,
    onClose,
  });

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
      <EditServiceForm form={form} nameRequired={nameRequired} />
    </FormContainer>
  );
};

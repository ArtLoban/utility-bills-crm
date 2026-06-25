"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { FormContainer } from "@/components/form-container";
import { ROUTES } from "@/lib/routes";
import { useCreateContractForm } from "@/features/contracts/hooks/use-create-contract-form";
import { CreateContractForm } from "./create-contract-form";
import type { PropertyId } from "@/lib/db/schema/properties";
import type { TProvider } from "@/lib/db/schema/providers";
import type { TServiceId } from "@/lib/db/schema/services";

type TProps = {
  propertyId: PropertyId;
  serviceId: TServiceId;
  providers: TProvider[];
};

export const CreateContractFormContent = ({ propertyId, serviceId, providers }: TProps) => {
  const router = useRouter();
  const t = useTranslations("contracts");
  const tForm = useTranslations("common.form");
  const onClose = () => router.back();

  const { form, handleSave, isSaving } = useCreateContractForm({ serviceId, onClose });

  return (
    <FormContainer
      onSubmit={handleSave}
      backHref={`${ROUTES.properties}/${propertyId}/services/${serviceId}`}
      submitText={t("modal.add.submit")}
      cancelText={t("modal.cancel")}
      savingText={tForm("saving")}
      footerText={tForm("syncNote")}
      size="sm"
      isSaving={isSaving}
      canSave={providers.length > 0}
    >
      <CreateContractForm form={form} providers={providers} />
    </FormContainer>
  );
};

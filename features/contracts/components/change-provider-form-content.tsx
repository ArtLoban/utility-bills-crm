"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { FormContainer } from "@/components/form-container";
import { ROUTES } from "@/lib/routes";
import { useChangeProviderForm } from "@/features/contracts/hooks/use-change-provider-form";
import { ChangeProviderForm } from "./change-provider-form";
import type { PropertyId } from "@/lib/db/schema/properties";
import type { ProviderId, TProvider } from "@/lib/db/schema/providers";
import type { TServiceId } from "@/lib/db/schema/services";

type TProps = {
  propertyId: PropertyId;
  serviceId: TServiceId;
  currentProviderId: ProviderId;
  providers: TProvider[];
};

export const ChangeProviderFormContent = ({
  propertyId,
  serviceId,
  currentProviderId,
  providers,
}: TProps) => {
  const router = useRouter();
  const t = useTranslations("contracts");
  const tForm = useTranslations("common.form");
  const onClose = () => router.back();

  const { form, handleSave, isSaving } = useChangeProviderForm({ serviceId, onClose });

  const availableProviders = providers.filter((p) => p.id !== currentProviderId);

  return (
    <FormContainer
      onSubmit={handleSave}
      backHref={`${ROUTES.properties}/${propertyId}/services/${serviceId}`}
      submitText={t("modal.changeProvider.submit")}
      cancelText={t("modal.cancel")}
      savingText={tForm("saving")}
      footerText={tForm("syncNote")}
      size="sm"
      isSaving={isSaving}
      canSave={availableProviders.length > 0}
    >
      <ChangeProviderForm form={form} providers={availableProviders} />
    </FormContainer>
  );
};

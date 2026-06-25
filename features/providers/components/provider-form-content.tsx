"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { FormContainer } from "@/components/form-container";
import { ROUTES } from "@/lib/routes";
import { useProviderForm } from "@/features/providers/hooks/use-provider-form";
import { ProviderForm } from "./provider-form";
import type { TProvider } from "@/lib/db/schema/providers";

type TProps = {
  provider?: TProvider;
};

export const ProviderFormContent = ({ provider }: TProps) => {
  const router = useRouter();
  const t = useTranslations("providers");
  const tForm = useTranslations("common.form");
  const onClose = () => router.back();

  const { form, handleSave, isSaving, isEditMode } = useProviderForm({ provider, onClose });

  return (
    <FormContainer
      onSubmit={handleSave}
      backHref={ROUTES.providers}
      submitText={t(isEditMode ? "modal.edit.submit" : "modal.add.submit")}
      cancelText={t("modal.cancel")}
      savingText={tForm("saving")}
      footerText={tForm("syncNote")}
      size="sm"
      isSaving={isSaving}
    >
      <ProviderForm form={form} />
    </FormContainer>
  );
};

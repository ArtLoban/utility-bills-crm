"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { useProviderForm } from "@/features/providers/hooks/use-provider-form";
import { ProviderForm } from "./provider-form";
import type { TProvider } from "@/lib/db/schema/providers";
import { FormContainer } from "@/components/form-container";

type TProps = {
  provider?: TProvider;
};

export const ProviderFormContent = ({ provider }: TProps) => {
  const router = useRouter();
  const t = useTranslations("providers");
  const onClose = () => router.back();

  const { form, errors, formError, set, handleSave, isSaving, canSave, isEditMode } =
    useProviderForm({ provider, onClose });

  return (
    <FormContainer
      onSubmit={handleSave}
      backHref="/providers"
      submitText={t(isEditMode ? "modal.edit.submit" : "modal.add.submit")}
      size="sm"
      isSaving={isSaving}
      canSave={canSave}
    >
      <ProviderForm form={form} errors={errors} formError={formError} set={set} />
    </FormContainer>
  );
};

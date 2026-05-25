"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { Modal } from "@/components/modal";
import { useProviderForm } from "@/features/providers/hooks/use-provider-form";
import { ProviderForm } from "./provider-form";
import type { TProvider } from "@/lib/db/schema/providers";

type TProps = {
  provider?: TProvider;
};

export const ProviderModal = ({ provider }: TProps) => {
  const router = useRouter();
  const t = useTranslations("providers");
  const onClose = () => router.back();

  const { form, errors, formError, set, handleSave, isSaving, canSave, isEditMode } =
    useProviderForm({ provider, onClose });

  return (
    <Modal
      open
      onOpenChange={(open) => !open && onClose()}
      title={t(isEditMode ? "modal.edit.title" : "modal.add.title")}
      submitText={t(isEditMode ? "modal.edit.submit" : "modal.add.submit")}
      onSubmit={handleSave}
      isSaving={isSaving}
      canSave={canSave}
    >
      <ProviderForm form={form} errors={errors} formError={formError} set={set} />
    </Modal>
  );
};

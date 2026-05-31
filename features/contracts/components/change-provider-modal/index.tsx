"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { Modal } from "@/components/modal";
import type { ProviderId, TProvider } from "@/lib/db/schema/providers";
import type { TServiceId } from "@/lib/db/schema/services";
import { useChangeProviderForm } from "./hooks/use-change-provider-form";
import { ChangeProviderFormContent } from "./change-provider-form-content";

type TProps = {
  serviceId: TServiceId;
  currentProviderId: ProviderId;
  providers: TProvider[];
};

export const ChangeProviderModal = ({ serviceId, currentProviderId, providers }: TProps) => {
  const router = useRouter();
  const t = useTranslations("contracts");
  const onClose = () => router.back();

  const { form, errors, formError, set, handleSave, isSaving, canSave } = useChangeProviderForm({
    serviceId,
  });

  const availableProviders = providers.filter((p) => p.id !== currentProviderId);

  return (
    <Modal
      open
      onOpenChange={(open) => !open && onClose()}
      title={t("modal.changeProvider.title")}
      confirmLabel={t("modal.changeProvider.submit")}
      onConfirm={handleSave}
      isSaving={isSaving}
      canSave={canSave && availableProviders.length > 0}
    >
      <ChangeProviderFormContent
        form={form}
        errors={errors}
        formError={formError}
        set={set}
        providers={providers}
        currentProviderId={currentProviderId}
      />
    </Modal>
  );
};

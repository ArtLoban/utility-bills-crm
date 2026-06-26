"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { Modal } from "@/components/modal";
import { useChangeProviderForm } from "@/features/contracts/hooks/use-change-provider-form";
import { ChangeProviderForm } from "./change-provider-form";
import type { ProviderId, TProvider } from "@/lib/db/schema/providers";
import type { TServiceId } from "@/lib/db/schema/services";

type TProps = {
  serviceId: TServiceId;
  currentProviderId: ProviderId;
  providers: TProvider[];
};

export const ChangeProviderModal = ({ serviceId, currentProviderId, providers }: TProps) => {
  const router = useRouter();
  const t = useTranslations("contracts");
  const onClose = () => router.back();

  const { form, handleSave, isSaving } = useChangeProviderForm({ serviceId, onClose });

  const availableProviders = providers.filter((p) => p.id !== currentProviderId);

  return (
    <Modal
      open
      onOpenChange={(open) => !open && onClose()}
      title={t("modal.changeProvider.title")}
      confirmLabel={t("modal.changeProvider.submit")}
      cancelLabel={t("modal.cancel")}
      onConfirm={handleSave}
      isSaving={isSaving}
      canSave={availableProviders.length > 0}
    >
      <ChangeProviderForm form={form} providers={availableProviders} />
    </Modal>
  );
};

"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { Modal } from "@/components/modal";
import { useCreateContractForm } from "@/features/contracts/hooks/use-create-contract-form";
import { CreateContractForm } from "./create-contract-form";
import type { TProvider } from "@/lib/db/schema/providers";
import type { TServiceId } from "@/lib/db/schema/services";

type TProps = {
  serviceId: TServiceId;
  providers: TProvider[];
};

export const CreateContractModal = ({ serviceId, providers }: TProps) => {
  const router = useRouter();
  const t = useTranslations("contracts");
  const onClose = () => router.back();

  const { form, handleSave, isSaving } = useCreateContractForm({ serviceId, onClose });

  return (
    <Modal
      open
      onOpenChange={(open) => !open && onClose()}
      title={t("modal.add.title")}
      confirmLabel={t("modal.add.submit")}
      cancelLabel={t("modal.cancel")}
      onConfirm={handleSave}
      isSaving={isSaving}
      canSave={providers.length > 0}
    >
      <CreateContractForm form={form} providers={providers} />
    </Modal>
  );
};

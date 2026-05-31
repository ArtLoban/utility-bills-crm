"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { Modal } from "@/components/modal";
import type { TProvider } from "@/lib/db/schema/providers";
import type { TServiceId } from "@/lib/db/schema/services";
import { useCreateContractForm } from "./hooks/use-create-contract-form";
import { CreateContractFormContent } from "./create-contract-form-content";

type TProps = {
  serviceId: TServiceId;
  providers: TProvider[];
};

export const CreateContractModal = ({ serviceId, providers }: TProps) => {
  const router = useRouter();
  const t = useTranslations("contracts");
  const onClose = () => router.back();

  const { form, errors, formError, set, handleSave, isSaving, canSave } = useCreateContractForm({
    serviceId,
  });

  return (
    <Modal
      open
      onOpenChange={(open) => !open && onClose()}
      title={t("modal.add.title")}
      confirmLabel={t("modal.add.submit")}
      onConfirm={handleSave}
      isSaving={isSaving}
      canSave={canSave && providers.length > 0}
    >
      <CreateContractFormContent
        form={form}
        errors={errors}
        formError={formError}
        set={set}
        providers={providers}
      />
    </Modal>
  );
};

"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { Modal } from "@/components/modal";
import { useEditService } from "@/features/services/hooks/use-edit-service";
import { EditServiceForm } from "./edit-service-form";
import type { TServiceId } from "@/lib/db/schema/services";

type TProps = {
  serviceId: TServiceId;
  initialNotes: string | null;
};

export const EditServiceModal = ({ serviceId, initialNotes }: TProps) => {
  const router = useRouter();
  const t = useTranslations("services.editNotes");
  const onClose = () => router.back();

  const { form, handleSave, isSaving } = useEditService({ serviceId, initialNotes, onClose });

  return (
    <Modal
      open
      onOpenChange={(open) => !open && onClose()}
      title={t("title")}
      confirmLabel={t("submit")}
      cancelLabel={t("cancel")}
      onConfirm={handleSave}
      isSaving={isSaving}
    >
      <EditServiceForm form={form} />
    </Modal>
  );
};

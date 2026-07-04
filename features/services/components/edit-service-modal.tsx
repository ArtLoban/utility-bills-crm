"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { Modal } from "@/components/modal";
import { useEditService } from "@/features/services/hooks/use-edit-service";
import type { TServiceTypeCode } from "@/features/services/service-type";
import { EditServiceForm } from "./edit-service-form";
import type { TServiceId } from "@/lib/db/schema/services";

type TProps = {
  serviceId: TServiceId;
  initialName: string | null;
  initialNotes: string | null;
  serviceTypeCode: TServiceTypeCode;
};

export const EditServiceModal = ({
  serviceId,
  initialName,
  initialNotes,
  serviceTypeCode,
}: TProps) => {
  const router = useRouter();
  const t = useTranslations("services.editService");
  const onClose = () => router.back();

  const { form, handleSave, isSaving, nameRequired } = useEditService({
    serviceId,
    initialName,
    initialNotes,
    serviceTypeCode,
    onClose,
  });

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
      <EditServiceForm form={form} nameRequired={nameRequired} />
    </Modal>
  );
};

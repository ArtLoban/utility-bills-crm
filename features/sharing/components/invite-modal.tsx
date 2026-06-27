"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { Modal } from "@/components/modal";
import { useInviteForm } from "@/features/sharing/hooks/use-invite-form";

import { InviteForm } from "./invite-form";

type TProps = {
  propertyId: string;
};

export const InviteModal = ({ propertyId }: TProps) => {
  const router = useRouter();
  const t = useTranslations("sharing");
  const onClose = () => router.back();

  const { form, handleSave, isSaving } = useInviteForm({ propertyId, onClose });

  return (
    <Modal
      open
      onOpenChange={(open) => !open && onClose()}
      title={t("inviteModal.title")}
      confirmLabel={t("actions.sendInvite")}
      cancelLabel={t("actions.cancel")}
      onConfirm={handleSave}
      isSaving={isSaving}
    >
      <InviteForm form={form} />
    </Modal>
  );
};

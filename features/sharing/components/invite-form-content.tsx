"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { FormContainer } from "@/components/form-container";
import { ROUTES } from "@/lib/routes";
import { useInviteForm } from "@/features/sharing/hooks/use-invite-form";

import { InviteForm } from "./invite-form";

type TProps = {
  propertyId: string;
};

export const InviteFormContent = ({ propertyId }: TProps) => {
  const router = useRouter();
  const t = useTranslations("sharing");
  const onClose = () => router.back();

  const { form, handleSave, isSaving } = useInviteForm({ propertyId, onClose });

  return (
    <FormContainer
      onSubmit={handleSave}
      backHref={`${ROUTES.properties}/${propertyId}?tab=sharing`}
      submitText={t("actions.sendInvite")}
      cancelText={t("actions.cancel")}
      savingText={t("inviteModal.sending")}
      footerText={t("banner.ownerInfo")}
      size="sm"
      isSaving={isSaving}
    >
      <InviteForm form={form} />
    </FormContainer>
  );
};

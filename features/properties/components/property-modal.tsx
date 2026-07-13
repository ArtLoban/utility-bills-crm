"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { Modal } from "@/components/modal";
import { usePropertyForm } from "@/features/properties/hooks/use-property-form";
import { PropertyForm } from "./property-form";
import type { TPropertyDetail } from "@/app/(secure)/(app)/properties/[id]/_data/queries";

type TProps = {
  property?: TPropertyDetail;
};

export const PropertyModal = ({ property }: TProps) => {
  const router = useRouter();
  const t = useTranslations("properties");
  const onClose = () => router.back();

  const { form, handleSave, isSaving, isEditMode } = usePropertyForm({ property, onClose });

  return (
    <Modal
      open
      onOpenChange={(open) => !open && onClose()}
      title={t(isEditMode ? "modal.edit.title" : "modal.add.title")}
      confirmLabel={t(isEditMode ? "modal.edit.submit" : "modal.add.submit")}
      cancelLabel={t("modal.cancel")}
      onConfirm={handleSave}
      isSaving={isSaving}
    >
      <PropertyForm form={form} />
    </Modal>
  );
};

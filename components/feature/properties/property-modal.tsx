"use client";

import { useTranslations } from "next-intl";
import { Modal } from "@/components/modal";
import { PropertyForm } from "@/components/feature/properties/property-form";
import { usePropertyForm } from "@/components/feature/properties/hooks/use-property-form";
import { TPropertyDetail } from "@/app/(app)/properties/_data/mock";

type TProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  property?: TPropertyDetail;
  onCreated?: (id: string) => void;
};

export const PropertyModal = ({ open, onOpenChange, property, onCreated }: TProps) => {
  const t = useTranslations("properties");
  const { form, errors, set, handleSave, isSaving, canSave, isEditMode } = usePropertyForm({
    open,
    onOpenChange,
    property,
    onCreated,
  });

  return (
    <Modal
      title={t(isEditMode ? "modal.edit.title" : "modal.add.title")}
      submitText={t(isEditMode ? "modal.edit.submit" : "modal.add.submit")}
      open={open}
      onOpenChange={onOpenChange}
      onSubmit={handleSave}
      canSave={canSave}
      isSaving={isSaving}
    >
      <PropertyForm form={form} errors={errors} set={set} />
    </Modal>
  );
};

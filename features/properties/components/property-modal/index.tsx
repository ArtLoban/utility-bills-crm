"use client";

import { useTranslations } from "next-intl";
import { Modal } from "@/components/modal";
import { PropertyForm } from "./components/property-form";
import { usePropertyForm } from "./hooks/use-property-form";
import type { TPropertyDetail } from "@/app/(app)/properties/[id]/_data/queries";

type TProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  property?: TPropertyDetail;
  onCreated?: (id: string) => void;
};

export const PropertyModal = ({ open, onOpenChange, property, onCreated }: TProps) => {
  const t = useTranslations("properties");
  const { form, errors, formError, set, handleSave, isSaving, canSave, isEditMode } =
    usePropertyForm({ open, onOpenChange, property, onCreated });

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
      <PropertyForm form={form} errors={errors} formError={formError} set={set} />
    </Modal>
  );
};

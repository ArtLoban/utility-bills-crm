"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { Modal } from "@/components/modal";
import { useAddMeterForm } from "@/features/meters/hooks/use-add-meter-form";
import type { TServiceType } from "@/lib/db/schema/service-types";

import { AddMeterForm } from "./add-meter-form";

type TProps = {
  propertyId: string;
  availableServiceTypes: TServiceType[];
};

export const AddMeterModal = ({ propertyId, availableServiceTypes }: TProps) => {
  const router = useRouter();
  const t = useTranslations("meters.addForm");
  const onClose = () => router.back();

  const { form, handleSave, isSaving, supportsZones } = useAddMeterForm({
    propertyId,
    availableServiceTypes,
    onClose,
  });

  return (
    <Modal
      open
      onOpenChange={(open) => !open && onClose()}
      title={t("title")}
      description={t("description")}
      confirmLabel={t("actions.add")}
      cancelLabel={t("actions.cancel")}
      onConfirm={handleSave}
      canSave={availableServiceTypes.length > 0}
      isSaving={isSaving}
    >
      <AddMeterForm
        form={form}
        availableServiceTypes={availableServiceTypes}
        supportsZones={supportsZones}
      />
    </Modal>
  );
};

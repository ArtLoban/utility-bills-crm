"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { Modal } from "@/components/modal";
import { useAddMeterForm } from "@/features/meters/hooks/use-add-meter-form";
import type { TEligibleMeterService } from "@/features/meters/types";
import type { TServiceType } from "@/lib/db/schema/service-types";

import { AddMeterForm } from "./add-meter-form";

type TProps = {
  propertyId: string;
  availableServiceTypes: TServiceType[];
  eligibleServices: TEligibleMeterService[];
};

export const AddMeterModal = ({ propertyId, availableServiceTypes, eligibleServices }: TProps) => {
  const router = useRouter();
  const t = useTranslations("meters.addForm");
  const onClose = () => router.back();

  const { form, handleSave, isSaving, supportsZones, servicesOfType } = useAddMeterForm({
    propertyId,
    availableServiceTypes,
    eligibleServices,
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
        servicesOfType={servicesOfType}
        supportsZones={supportsZones}
      />
    </Modal>
  );
};

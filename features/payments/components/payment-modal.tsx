"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { Modal } from "@/components/modal";
import type { PropertyId } from "@/lib/db/schema/properties";
import type { TServiceOption } from "@/lib/db/access/payments";
import type { TPaymentGlobalRow } from "@/features/payments/types";
import { PaymentForm } from "./payment-form";
import { usePaymentForm } from "../hooks/use-payment-form";

type TProps = {
  payment?: TPaymentGlobalRow;
  propertyOptions?: { id: PropertyId; name: string }[];
  serviceOptions?: Record<PropertyId, TServiceOption[]>;
};

export const PaymentModal = ({ payment, propertyOptions, serviceOptions }: TProps) => {
  const router = useRouter();
  const t = useTranslations("payments");
  const onClose = () => router.back();

  const {
    form,
    handleSave,
    isSaving,
    isEditMode,
    properties,
    availableServices,
    currentDebt,
    resetService,
    lockedPropertyName,
    lockedServiceLabel,
  } = usePaymentForm({ payment, propertyOptions, serviceOptions, onClose });

  return (
    <Modal
      open={true}
      onOpenChange={(open) => !open && onClose()}
      title={t(isEditMode ? "modal.edit.title" : "modal.add.title")}
      confirmLabel={t(isEditMode ? "modal.edit.submit" : "modal.add.submit")}
      cancelLabel={t("modal.cancel")}
      onConfirm={handleSave}
      isSaving={isSaving}
    >
      <PaymentForm
        form={form}
        isEditMode={isEditMode}
        properties={properties}
        availableServices={availableServices}
        currentDebt={currentDebt}
        onPropertyChange={resetService}
        lockedPropertyName={lockedPropertyName}
        lockedServiceLabel={lockedServiceLabel}
      />
    </Modal>
  );
};

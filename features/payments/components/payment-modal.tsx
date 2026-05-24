"use client";

import { useRouter } from "next/navigation";

import { Modal } from "@/components/modal";
import { PaymentForm } from "./payment-form";
import { usePaymentForm } from "../hooks/use-payment-form";
import type { TPaymentRecord } from "../types";

type TProps = {
  payment?: TPaymentRecord;
};

export const PaymentModal = ({ payment }: TProps) => {
  const router = useRouter();
  const onClose = () => router.back();

  const {
    form,
    isSaving,
    properties,
    filteredServices,
    selectedPropertyId,
    onPropertyChange,
    handleSave,
    isEditMode,
  } = usePaymentForm({ payment, onClose });

  return (
    <Modal
      open={true}
      onOpenChange={(open) => !open && onClose()}
      title={isEditMode ? "Edit Payment" : "Record Payment"}
      submitText={isEditMode ? "Update" : "Record Payment"}
      onSubmit={handleSave}
      isSaving={isSaving}
    >
      <PaymentForm
        form={form}
        properties={properties}
        services={filteredServices}
        selectedPropertyId={selectedPropertyId}
        onPropertyChange={onPropertyChange}
      />
    </Modal>
  );
};

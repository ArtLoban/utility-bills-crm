"use client";

import { useRouter } from "next/navigation";

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
    currentDebt,
  } = usePaymentForm({ payment, propertyOptions, serviceOptions, onClose });

  return (
    <Modal
      open={true}
      onOpenChange={(open) => !open && onClose()}
      title={isEditMode ? "Edit Payment" : "Record Payment"}
      confirmLabel={isEditMode ? "Update" : "Record Payment"}
      onConfirm={handleSave}
      isSaving={isSaving}
    >
      <PaymentForm
        form={form}
        properties={properties}
        services={filteredServices}
        selectedPropertyId={selectedPropertyId}
        onPropertyChange={onPropertyChange}
        currentDebt={currentDebt}
      />
    </Modal>
  );
};

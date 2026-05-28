"use client";

import { useRouter } from "next/navigation";

import { PaymentForm } from "../payment-form";
import { usePaymentForm } from "../../hooks/use-payment-form";
import type { TPaymentRecord } from "../../types";
import { FormContainer } from "@/components/form-container";

type TProps = {
  payment?: TPaymentRecord;
};

export const PaymentFormContent = ({ payment }: TProps) => {
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
    <FormContainer
      onSubmit={handleSave}
      backHref="/payments"
      submitText={isEditMode ? "Update" : "Record Payment"}
      size="sm"
      isSaving={isSaving}
      // canSave={canSave}
    >
      <PaymentForm
        form={form}
        properties={properties}
        services={filteredServices}
        selectedPropertyId={selectedPropertyId}
        onPropertyChange={onPropertyChange}
      />
    </FormContainer>
  );
};

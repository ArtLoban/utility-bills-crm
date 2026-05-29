"use client";

import { useRouter } from "next/navigation";

import { FormContainer } from "@/components/form-container";
import type { PropertyId } from "@/lib/db/schema/properties";
import type { TServiceOption } from "@/lib/db/access/payments";
import type { TPaymentGlobalRow } from "@/features/payments/types";
import { PaymentForm } from "../payment-form";
import { usePaymentForm } from "../../hooks/use-payment-form";

type TProps = {
  payment?: TPaymentGlobalRow;
  propertyOptions?: { id: PropertyId; name: string }[];
  serviceOptions?: Record<PropertyId, TServiceOption[]>;
};

export const PaymentFormContent = ({ payment, propertyOptions, serviceOptions }: TProps) => {
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
  } = usePaymentForm({ payment, propertyOptions, serviceOptions, onClose });

  return (
    <FormContainer
      onSubmit={handleSave}
      backHref="/payments"
      submitText={isEditMode ? "Update" : "Record Payment"}
      size="sm"
      isSaving={isSaving}
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

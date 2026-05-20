"use client";

import { useRouter } from "next/navigation";

import { Modal } from "@/components/modal";
import { PaymentForm } from "@/components/feature/payments/payment-form";
import { usePaymentForm } from "@/components/feature/payments/hooks/use-payment-form";

export const CreatePaymentModal = () => {
  const router = useRouter();
  const { form, properties, filteredServices, selectedPropertyId, onPropertyChange, handleSave } =
    usePaymentForm();

  return (
    <Modal
      title="Create Payment"
      submitText="Save"
      open
      onOpenChange={(open) => {
        if (!open) router.back();
      }}
      onSubmit={handleSave}
      isSaving={form.formState.isSubmitting}
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

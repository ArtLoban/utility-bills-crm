"use client";

import { useRouter } from "next/navigation";

import { Modal } from "@/components/modal";
import { PaymentForm } from "@/features/payments/components/payment-form";
import { usePaymentForm } from "@/features/payments/hooks/use-payment-form";

type TProps = {
  payment: { id: string };
};

export const EditPaymentModal = ({ payment: { id } }: TProps) => {
  const router = useRouter();
  // devnote: pass full TPaymentRecord to usePaymentForm when DB query is connected (see route page.tsx)
  const { form, properties, filteredServices, selectedPropertyId, onPropertyChange, handleSave } =
    usePaymentForm();

  console.log("EditPaymentModal — payment id:", id);

  return (
    <Modal
      title="Edit Payment"
      submitText="Update"
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

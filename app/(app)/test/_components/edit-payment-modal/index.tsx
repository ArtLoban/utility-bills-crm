"use client";

import { useRouter } from "next/navigation";

import { Modal } from "@/components/modal";
import { TPayment } from "@/app/(app)/payments/_data/mock";

type TProps = {
  payment: TPayment;
};

export const EditPaymentModal = ({ payment }: TProps) => {
  const router = useRouter();

  const handleSave = () => {
    console.log("handleSave", handleSave, payment);
  };

  return (
    <Modal
      title="Edit Payment"
      submitText="Update"
      open
      onOpenChange={(open) => {
        if (!open) router.back();
      }}
      onSubmit={handleSave}
      // canSave={canSave}
      // isSaving={isSaving}
    >
      Form {payment.id}
    </Modal>
  );
};

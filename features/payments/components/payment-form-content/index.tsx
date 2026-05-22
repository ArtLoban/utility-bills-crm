"use client";

import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PaymentForm } from "../payment-form";
import { usePaymentForm } from "../../hooks/use-payment-form";
import type { TPaymentRecord } from "../../types";

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
    <div className="flex flex-col gap-6">
      <PaymentForm
        form={form}
        properties={properties}
        services={filteredServices}
        selectedPropertyId={selectedPropertyId}
        onPropertyChange={onPropertyChange}
      />
      <div className="flex justify-end gap-2">
        <Button variant="outline" type="button" onClick={onClose}>
          Cancel
        </Button>
        <Button type="button" onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Saving…
            </>
          ) : isEditMode ? (
            "Update"
          ) : (
            "Record Payment"
          )}
        </Button>
      </div>
    </div>
  );
};

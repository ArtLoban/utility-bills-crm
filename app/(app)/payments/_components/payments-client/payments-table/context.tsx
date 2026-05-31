"use client";

import { useState, useTransition, type ReactNode } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { createSafeContext } from "@/lib/utils/create-safe-context";
import type { TPaymentGlobalRow } from "@/features/payments/types";
import type { PaymentId } from "@/lib/db/schema/payments";
import { getServiceLabel } from "@/lib/constants/service-colors";
import { softDeletePayment } from "@/features/payments/actions";
import { Modal } from "@/components/modal";
import { IconBadge } from "@/components/icon-badge";

type TPaymentsTableContext = {
  requestDelete: (payment: TPaymentGlobalRow) => void;
};

const [PaymentsTableContext, usePaymentsTable] =
  createSafeContext<TPaymentsTableContext>("PaymentsTable");

export { usePaymentsTable };

export const PaymentsTableActions = ({ children }: { children: ReactNode }) => {
  const [rowToDelete, setRowToDelete] = useState<TPaymentGlobalRow | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleConfirm = () => {
    if (rowToDelete === null) return;
    startTransition(async () => {
      const result = await softDeletePayment(rowToDelete.payment.id as PaymentId);
      if (!result.ok) {
        toast.error("Failed to delete payment. Please try again.");
      } else {
        toast.success("Payment deleted");
      }
      setRowToDelete(null);
    });
  };

  return (
    <PaymentsTableContext value={{ requestDelete: setRowToDelete }}>
      {children}
      <Modal
        title="Delete Payment"
        open={rowToDelete !== null}
        onOpenChange={(open) => !open && setRowToDelete(null)}
        onConfirm={handleConfirm}
        variant="strongDestructive"
        confirmIcon={Trash2}
        confirmLabel="Delete"
        isSaving={isPending}
      >
        <div className="my-3 flex flex-col items-center gap-4">
          <IconBadge icon={Trash2} color="var(--destructive)" size="lg" border={true} />
          <p className="text-center text-sm">
            Delete{" "}
            <strong>{rowToDelete ? getServiceLabel(rowToDelete.serviceTypeCode) : ""}</strong>{" "}
            payment for <strong>{rowToDelete?.property.name ?? ""}</strong>?
          </p>
          <p className="text-destructive text-sm leading-snug font-semibold">
            This cannot be undone.
          </p>
        </div>
      </Modal>
    </PaymentsTableContext>
  );
};

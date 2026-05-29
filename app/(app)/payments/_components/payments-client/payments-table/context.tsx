"use client";

import { useState, useTransition, type ReactNode } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { createSafeContext } from "@/lib/utils/create-safe-context";
import type { TPaymentGlobalRow } from "@/features/payments/types";
import type { PaymentId } from "@/lib/db/schema/payments";
import { getServiceLabel } from "@/lib/constants/service-colors";
import { softDeletePayment } from "@/features/payments/actions";

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
      <ConfirmDialog
        open={rowToDelete !== null}
        onOpenChange={(open) => !open && setRowToDelete(null)}
        title="Delete Payment"
        tone="destructive"
        icon={<Trash2 size={28} />}
        description={
          <>
            Delete{" "}
            <strong>{rowToDelete ? getServiceLabel(rowToDelete.serviceTypeCode) : ""}</strong>{" "}
            payment for <strong>{rowToDelete?.property.name ?? ""}</strong>? This cannot be undone.
          </>
        }
        confirmLabel="Delete"
        confirmIcon={<Trash2 size={14} />}
        isPending={isPending}
        onConfirm={handleConfirm}
      />
    </PaymentsTableContext>
  );
};

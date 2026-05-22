"use client";

import { useState, useTransition, type ReactNode } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { createSafeContext } from "@/lib/utils/create-safe-context";
import type { TPayment } from "@/lib/types/models/payment";

type TPaymentsTableContextValue = {
  requestDelete: (payment: TPayment) => void;
};

const [PaymentsTableProvider, usePaymentsTable] =
  createSafeContext<TPaymentsTableContextValue>("PaymentsTable");

export { usePaymentsTable };

export const PaymentsTableActions = ({ children }: { children: ReactNode }) => {
  const [rowToDelete, setRowToDelete] = useState<TPayment | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleConfirm = () => {
    if (rowToDelete === null) return;
    startTransition(async () => {
      // devnote: wire to deletePayment server action when payments table exists
      await new Promise<void>((resolve) => setTimeout(resolve, 400));
      toast.success("Payment deleted");
      setRowToDelete(null);
    });
  };

  return (
    <PaymentsTableProvider value={{ requestDelete: setRowToDelete }}>
      {children}
      <ConfirmDialog
        open={rowToDelete !== null}
        onOpenChange={(open) => !open && setRowToDelete(null)}
        title="Delete Payment"
        tone="destructive"
        icon={<Trash2 size={28} />}
        description={
          <>
            Delete <strong>{rowToDelete?.service.name ?? ""}</strong> payment for{" "}
            <strong>{rowToDelete?.property.name ?? ""}</strong>? This cannot be undone.
          </>
        }
        confirmLabel="Delete"
        confirmIcon={<Trash2 size={14} />}
        isPending={isPending}
        onConfirm={handleConfirm}
      />
    </PaymentsTableProvider>
  );
};

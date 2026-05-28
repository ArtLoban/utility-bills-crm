"use client";

import { useState, useTransition, type ReactNode } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { createSafeContext } from "@/lib/utils/create-safe-context";
import { softDeleteBill } from "@/features/bills/actions";
import { getServiceLabel } from "@/lib/constants/service-colors";
import type { TBillGlobalRow } from "@/lib/db/access/bills";

type TBillsTableContext = {
  requestDelete: (bill: TBillGlobalRow) => void;
};

const [BillsTableContext, useBillsTable] = createSafeContext<TBillsTableContext>("BillsTable");

export { useBillsTable };

type TProps = {
  children: ReactNode;
};

export const BillsTableActions = ({ children }: TProps) => {
  const [rowToDelete, setRowToDelete] = useState<TBillGlobalRow | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleConfirmDelete = () => {
    if (!rowToDelete) return;
    const id = rowToDelete.bill.id;
    startTransition(async () => {
      const result = await softDeleteBill(id);
      if (!result.ok) {
        toast.error("Failed to delete bill. Please try again.");
      } else {
        toast.success("Bill deleted.");
      }
      setRowToDelete(null);
    });
  };

  return (
    <BillsTableContext value={{ requestDelete: setRowToDelete }}>
      {children}

      <ConfirmDialog
        open={rowToDelete !== null}
        onOpenChange={(open) => !open && setRowToDelete(null)}
        title="Delete Bill"
        tone="destructive"
        icon={<Trash2 size={28} />}
        description={
          <>
            Delete{" "}
            <strong>{rowToDelete ? getServiceLabel(rowToDelete.serviceTypeCode) : ""}</strong> bill
            for <strong>{rowToDelete?.property.name ?? ""}</strong>? This cannot be undone.
          </>
        }
        confirmLabel="Delete"
        confirmIcon={<Trash2 size={14} />}
        isPending={isPending}
        onConfirm={handleConfirmDelete}
      />
    </BillsTableContext>
  );
};

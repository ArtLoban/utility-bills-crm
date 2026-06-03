"use client";

import { useState, useTransition, type ReactNode } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { softDeleteBill } from "@/features/bills/actions";
import { getServiceLabel } from "@/lib/constants/service-colors";
import type { TBillGlobalRow } from "@/lib/db/access/bills";
import { IconBadge } from "@/components/icon-badge";
import { Modal } from "@/components/modal";
import type { TSelectableEntity } from "@/components/select-input/types";
import { BillsTableContext } from "@/app/(app)/bills/_components/bills-client/context";

type TProps = {
  children: ReactNode;
  properties: TSelectableEntity[];
};

export const BillsTableActions = ({ children, properties }: TProps) => {
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
    <BillsTableContext value={{ requestDelete: setRowToDelete, properties }}>
      {children}
      <Modal
        title="Delete Bill"
        open={rowToDelete !== null}
        onOpenChange={(open) => !open && setRowToDelete(null)}
        onConfirm={handleConfirmDelete}
        variant="strongDestructive"
        confirmIcon={Trash2}
        confirmLabel="Delete"
        isSaving={isPending}
      >
        <div className="my-3 flex flex-col items-center gap-4">
          <IconBadge icon={Trash2} color="var(--destructive)" size="lg" border={true} />
          <p className="text-center text-sm">
            Delete{" "}
            <strong>{rowToDelete ? getServiceLabel(rowToDelete.serviceTypeCode) : ""}</strong> bill
            for <strong>{rowToDelete?.property.name ?? ""}</strong>?
          </p>
          <p className="text-destructive text-sm leading-snug font-semibold">
            This cannot be undone.
          </p>
        </div>
      </Modal>
    </BillsTableContext>
  );
};

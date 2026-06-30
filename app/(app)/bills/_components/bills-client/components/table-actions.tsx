"use client";

import { useState, useTransition, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

import { softDeleteBill } from "@/features/bills/actions";
import { getServiceLabel } from "@/lib/constants/service-colors";
import type { TBillGlobalRow } from "@/lib/db/access/bills";
import type { TPropertyOption } from "@/features/properties";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { useActionErrorHandler } from "@/lib/hooks/use-action-error-handler";
import { BillsTableContext } from "@/app/(app)/bills/_components/bills-client/context";

type TProps = {
  children: ReactNode;
  properties: TPropertyOption[];
};

export const BillsTableActions = ({ children, properties }: TProps) => {
  const t = useTranslations("bills");
  const [rowToDelete, setRowToDelete] = useState<TBillGlobalRow | null>(null);
  const [isPending, startTransition] = useTransition();
  const handleActionError = useActionErrorHandler({ onClose: () => setRowToDelete(null) });

  const handleConfirmDelete = () => {
    if (!rowToDelete) return;
    const id = rowToDelete.bill.id;
    startTransition(async () => {
      const result = await softDeleteBill(id);
      if (!result.ok) {
        handleActionError(result.error);
        return;
      }
      toast.success(t("toast.deleted"));
      setRowToDelete(null);
    });
  };

  return (
    <BillsTableContext value={{ requestDelete: setRowToDelete, properties }}>
      {children}
      <ConfirmDialog
        open={rowToDelete !== null}
        onOpenChange={(open) => !open && setRowToDelete(null)}
        title={t("list.delete.confirm.title")}
        icon={Trash2}
        description={t.rich("list.delete.confirm.description", {
          service: rowToDelete ? getServiceLabel(rowToDelete.serviceTypeCode) : "",
          property: rowToDelete?.property.name ?? "",
          b: (chunks) => <strong>{chunks}</strong>,
        })}
        warningText={t("list.delete.confirm.body")}
        confirmLabel={t("list.delete.confirm.confirmLabel")}
        confirmIcon={Trash2}
        cancelLabel={t("list.delete.confirm.cancelLabel")}
        isPending={isPending}
        onConfirm={handleConfirmDelete}
      />
    </BillsTableContext>
  );
};

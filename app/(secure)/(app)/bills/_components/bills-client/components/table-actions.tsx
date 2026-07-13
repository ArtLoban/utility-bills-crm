"use client";

import { useState, useTransition, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

import { softDeleteBill } from "@/features/bills/actions";
import { resolveServiceTypeLabel } from "@/features/services/service-label";
import type { TBillGlobalRow } from "@/lib/db/access/bills";
import type { TPropertyOption } from "@/features/properties";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { useActionErrorHandler } from "@/lib/hooks/use-action-error-handler";
import { BillsTableContext } from "@/app/(secure)/(app)/bills/_components/bills-client/context";

type TProps = {
  children: ReactNode;
  properties: TPropertyOption[];
};

export const BillsTableActions = ({ children, properties }: TProps) => {
  const t = useTranslations("bills");
  const tServiceTypes = useTranslations("services.types");
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
        title={t("delete.confirm.title")}
        icon={Trash2}
        description={t.rich("delete.confirm.description", {
          service: rowToDelete
            ? resolveServiceTypeLabel(rowToDelete.serviceTypeCode, tServiceTypes)
            : "",
          property: rowToDelete?.property.name ?? "",
          b: (chunks) => <strong>{chunks}</strong>,
        })}
        warningText={t("delete.confirm.body")}
        confirmLabel={t("delete.confirm.confirmLabel")}
        confirmIcon={Trash2}
        cancelLabel={t("delete.confirm.cancelLabel")}
        isPending={isPending}
        onConfirm={handleConfirmDelete}
      />
    </BillsTableContext>
  );
};

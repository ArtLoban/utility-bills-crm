import { ReactNode, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

import { softDeletePayment, TPaymentGlobalRow } from "@/features/payments";
import type { TPropertyOption } from "@/features/properties";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { useActionErrorHandler } from "@/lib/hooks/use-action-error-handler";
import { resolveServiceTypeLabel } from "@/features/services/service-label";
import { PaymentsTableContext } from "../context";

type TProps = {
  children: ReactNode;
  properties: TPropertyOption[];
};

export const PaymentsTableActions = ({ children, properties }: TProps) => {
  const t = useTranslations("payments");
  const tServiceTypes = useTranslations("services.types");
  const [rowToDelete, setRowToDelete] = useState<TPaymentGlobalRow | null>(null);
  const [isPending, startTransition] = useTransition();
  const handleActionError = useActionErrorHandler({ onClose: () => setRowToDelete(null) });

  const handleConfirm = () => {
    if (rowToDelete === null) return;
    startTransition(async () => {
      const result = await softDeletePayment(rowToDelete.payment.id);
      if (!result.ok) {
        handleActionError(result.error);
        return;
      }
      toast.success(t("toast.deleted"));
      setRowToDelete(null);
    });
  };

  return (
    <PaymentsTableContext value={{ requestDelete: setRowToDelete, properties }}>
      {children}
      <ConfirmDialog
        open={rowToDelete !== null}
        onOpenChange={(open) => !open && setRowToDelete(null)}
        title={t("list.delete.confirm.title")}
        icon={Trash2}
        description={t.rich("list.delete.confirm.description", {
          service: rowToDelete
            ? resolveServiceTypeLabel(rowToDelete.serviceTypeCode, tServiceTypes)
            : "",
          property: rowToDelete?.property.name ?? "",
          b: (chunks) => <strong>{chunks}</strong>,
        })}
        warningText={t("list.delete.confirm.body")}
        confirmLabel={t("list.delete.confirm.confirmLabel")}
        confirmIcon={Trash2}
        cancelLabel={t("list.delete.confirm.cancelLabel")}
        isPending={isPending}
        onConfirm={handleConfirm}
      />
    </PaymentsTableContext>
  );
};

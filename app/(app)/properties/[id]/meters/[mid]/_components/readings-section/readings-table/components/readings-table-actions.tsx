"use client";

import { useState, useTransition, type ReactNode } from "react";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { softDeleteReading } from "@/features/readings";
import { DISPLAY_DATE_FORMAT } from "@/lib/format/date";
import { useActionErrorHandler } from "@/lib/hooks/use-action-error-handler";
import type { TReading } from "@/lib/db/schema/readings";

import { ReadingsTableContext } from "../context";

type TProps = {
  children: ReactNode;
};

export const ReadingsTableActions = ({ children }: TProps) => {
  const t = useTranslations("meters.detail.readings");
  const tCommon = useTranslations("common");
  const [rowToDelete, setRowToDelete] = useState<TReading | null>(null);
  const [isPending, startTransition] = useTransition();
  const handleActionError = useActionErrorHandler({ onClose: () => setRowToDelete(null) });

  const handleConfirmDelete = () => {
    if (!rowToDelete) return;
    const id = rowToDelete.id;
    startTransition(async () => {
      const result = await softDeleteReading(id);
      if (!result.ok) {
        handleActionError(result.error);
        return;
      }
      toast.success(t("delete.success"));
      setRowToDelete(null);
    });
  };

  return (
    <ReadingsTableContext value={{ requestDelete: setRowToDelete }}>
      {children}
      <ConfirmDialog
        open={rowToDelete !== null}
        onOpenChange={(open) => !open && setRowToDelete(null)}
        tone="destructive"
        icon={Trash2}
        title={t("delete.title")}
        description={t.rich("delete.question", {
          date: rowToDelete ? format(new Date(rowToDelete.readAt), DISPLAY_DATE_FORMAT) : "",
          b: (chunks) => <strong>{chunks}</strong>,
        })}
        warningText={t("delete.warning")}
        confirmIcon={Trash2}
        confirmLabel={t("delete.confirm")}
        cancelLabel={tCommon("cancel")}
        isPending={isPending}
        onConfirm={handleConfirmDelete}
      />
    </ReadingsTableContext>
  );
};

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { useActionErrorHandler } from "@/lib/hooks/use-action-error-handler";
import type { ReminderId } from "@/lib/db/schema/notifications";

import { deleteReminder } from "../../../actions";

type TProps = {
  reminderId: ReminderId;
};

export const DeleteReminderAction = ({ reminderId }: TProps) => {
  const t = useTranslations("reminders");
  const router = useRouter();
  const handleActionError = useActionErrorHandler({});
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleConfirm = async () => {
    setIsPending(true);
    try {
      const result = await deleteReminder(reminderId);
      if (!result.ok) {
        handleActionError(result.error);
        return;
      }
      toast.success(t("toast.deleted"));
      setOpen(false);
      router.refresh();
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t("row.delete")}
        className="border-border text-muted-foreground hover:border-destructive/30 hover:bg-destructive/10 hover:text-destructive flex size-8 cursor-pointer items-center justify-center rounded-md border transition-colors"
      >
        <Trash2 size={14} />
      </button>

      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title={t("delete.title")}
        tone="destructive"
        icon={Trash2}
        description={t("delete.description")}
        confirmLabel={t("delete.confirm")}
        cancelLabel={t("modal.cancel")}
        isPending={isPending}
        onConfirm={handleConfirm}
      />
    </>
  );
};

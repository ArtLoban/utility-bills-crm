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
import { Button } from "@/components/ui/button";

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
      <Button
        onClick={() => setOpen(true)}
        variant="outline"
        size="icon"
        className="hover:border-destructive/30 hover:bg-destructive/10 hover:text-destructive rounded-md"
        aria-label={t("row.delete")}
      >
        <Trash2 />
      </Button>
      {/* devnote TODO: FIx this shit! ConfirmDialog - в каждом row!!! Использовать контекст! */}
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

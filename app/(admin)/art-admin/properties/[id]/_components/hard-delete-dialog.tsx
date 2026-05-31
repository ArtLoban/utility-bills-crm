"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { hardDeleteProperty } from "@/features/admin-properties/actions";

type TProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  propertyId: string;
  propertyName: string;
  onSuccess?: () => void;
};

export const HardDeleteDialog = ({
  open,
  onOpenChange,
  propertyId,
  propertyName,
  onSuccess,
}: TProps) => {
  const t = useTranslations("adminProperties");
  const [isPending, startTransition] = useTransition();

  const handleConfirm = () => {
    startTransition(async () => {
      const result = await hardDeleteProperty(propertyId);
      if (result.ok) {
        toast.success(t("success.hardDeleted"));
        onOpenChange(false);
        onSuccess?.();
      } else {
        const code = result.error.message as string;
        const key = `errors.${code}` as Parameters<typeof t>[0];
        toast.error(t.has(key) ? t(key) : t("errors.generic"));
      }
    });
  };

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      tone="destructive"
      icon={<Trash2 size={22} strokeWidth={1.75} />}
      title={t("hardDeleteDialog.title")}
      description={t("hardDeleteDialog.description", { name: propertyName })}
      warningText={t("hardDeleteDialog.warning")}
      requireType="DELETE"
      confirmLabel={t("hardDeleteDialog.confirm")}
      cancelLabel={t("hardDeleteDialog.cancel")}
      isPending={isPending}
      onConfirm={handleConfirm}
    />
  );
};

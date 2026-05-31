"use client";

import { useTransition } from "react";
import { RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { restoreProperty } from "@/features/admin-properties/actions";

type TProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  propertyId: string;
  propertyName: string;
  onSuccess?: () => void;
};

export const RestoreDialog = ({
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
      const result = await restoreProperty(propertyId);
      if (result.ok) {
        toast.success(t("success.restored"));
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
      tone="warning"
      icon={<RotateCcw size={22} strokeWidth={1.75} />}
      title={t("restoreDialog.title")}
      description={t("restoreDialog.description", { name: propertyName })}
      confirmLabel={t("restoreDialog.confirm")}
      cancelLabel={t("restoreDialog.cancel")}
      isPending={isPending}
      onConfirm={handleConfirm}
    />
  );
};

"use client";

import { useTransition } from "react";
import { RotateCcw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { restoreProperty } from "@/features/admin-properties/actions";
import { IconBadge } from "@/components/icon-badge";
import { Modal } from "@/components/modal";

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
    <Modal
      title={t("restoreDialog.title")}
      open={open}
      onOpenChange={onOpenChange}
      onConfirm={handleConfirm}
      variant="warning"
      confirmIcon={RotateCcw}
      confirmLabel={t("restoreDialog.confirm")}
      isSaving={isPending}
    >
      <div className="my-3 flex flex-col items-center gap-4">
        <IconBadge icon={RotateCcw} color="var(--warning)" size="lg" border={true} />
        <p className="text-center text-sm">
          <strong>{propertyName}</strong> {t("restoreDialog.description")}
        </p>
      </div>
    </Modal>
  );
};

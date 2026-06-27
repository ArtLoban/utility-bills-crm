"use client";

import { LogOut } from "lucide-react";
import { useTranslations } from "next-intl";

import { ConfirmDialog } from "@/components/confirm-dialog";

type TProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isPending: boolean;
  propertyName: string;
};

export const LeavePropertyDialog = ({
  open,
  onOpenChange,
  onConfirm,
  isPending,
  propertyName,
}: TProps) => {
  const t = useTranslations("sharing");

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      tone="destructive"
      icon={LogOut}
      title={t("leaveConfirmModal.title")}
      description={t.rich("leaveConfirmModal.body", {
        propertyName,
        strong: (chunks) => <strong>{chunks}</strong>,
      })}
      confirmLabel={isPending ? t("leaveConfirmModal.leaving") : t("actions.leave")}
      cancelLabel={t("actions.cancel")}
      isPending={isPending}
      onConfirm={onConfirm}
    />
  );
};

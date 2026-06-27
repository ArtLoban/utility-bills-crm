"use client";

import { AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";

import { ConfirmDialog } from "@/components/confirm-dialog";

type TProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  propertyName: string;
};

export const LastOwnerDialog = ({ open, onOpenChange, propertyName }: TProps) => {
  const t = useTranslations("sharing");

  const steps = [t("lastOwnerModal.step1"), t("lastOwnerModal.step2")];

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      tone="warning"
      icon={AlertCircle}
      title={t("lastOwnerModal.title")}
      description={t.rich("lastOwnerModal.body", {
        propertyName,
        strong: (chunks) => <strong>{chunks}</strong>,
      })}
      secondaryText={t("lastOwnerModal.guidance")}
      cancelLabel={null}
      confirmLabel={t("actions.gotIt")}
      onConfirm={() => onOpenChange(false)}
    >
      <div className="mt-3 flex flex-col gap-2">
        {steps.map((text, index) => (
          <div
            key={index}
            className="border-border bg-muted flex flex-row gap-3 rounded-lg border px-3.5 py-3"
          >
            <div className="bg-secondary text-muted-foreground flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full text-xs font-bold">
              {index + 1}
            </div>
            <p className="m-0 text-sm leading-normal">{text}</p>
          </div>
        ))}
      </div>
    </ConfirmDialog>
  );
};

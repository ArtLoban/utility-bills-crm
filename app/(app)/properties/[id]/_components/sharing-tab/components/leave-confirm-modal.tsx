"use client";

import { LogOut, X } from "lucide-react";
import { useTranslations } from "next-intl";

import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";

type TProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isPending: boolean;
  propertyName: string;
};

export const LeaveConfirmModal = ({
  open,
  onOpenChange,
  onConfirm,
  isPending,
  propertyName,
}: TProps) => {
  const t = useTranslations("sharing");

  return (
    <Dialog open={open} onOpenChange={isPending ? undefined : onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-[460px] gap-0 rounded-[10px] p-0 shadow-[0_20px_60px_rgba(9,9,11,0.18),0_4px_16px_rgba(9,9,11,0.10)] sm:max-w-[460px]"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4">
          <DialogTitle className="text-md font-semibold tracking-[-0.2px]">
            {t("leaveConfirmModal.title")}
          </DialogTitle>
          <DialogClose
            disabled={isPending}
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent p-0 disabled:cursor-default disabled:opacity-40"
          >
            <X size={15} className="text-zinc-500" />
          </DialogClose>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <div className="mb-5 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-[14px] border border-[#fecaca] bg-[#fef2f2]">
              <LogOut size={28} color="#dc2626" />
            </div>
          </div>

          <p className="text-center text-sm leading-[1.55]">
            {t.rich("leaveConfirmModal.body", {
              propertyName,
              strong: (chunks) => <strong>{chunks}</strong>,
            })}
          </p>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between border-t border-zinc-200 bg-zinc-50 px-6 py-3.5"
          style={{ borderRadius: "0 0 10px 10px" }}
        >
          <DialogClose
            disabled={isPending}
            className="inline-flex h-[34px] cursor-pointer items-center rounded-[6px] border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-950 disabled:cursor-default disabled:opacity-40"
          >
            {t("actions.cancel")}
          </DialogClose>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className={
              isPending
                ? "inline-flex h-[34px] cursor-default items-center rounded-[6px] border-0 bg-zinc-200 px-4 text-sm font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                : "inline-flex h-[34px] cursor-pointer items-center rounded-[6px] border-0 bg-[#dc2626] px-4 text-sm font-medium text-white"
            }
          >
            {isPending ? t("leaveConfirmModal.leaving") : t("actions.leave")}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

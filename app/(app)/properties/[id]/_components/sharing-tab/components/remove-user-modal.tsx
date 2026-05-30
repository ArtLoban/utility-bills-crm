"use client";

import { UserMinus, X } from "lucide-react";
import { useTranslations } from "next-intl";

import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { TSharedUser } from "../types";
import { Avatar } from "./avatar";

type TProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: TSharedUser | null;
  propertyName: string;
};

export const RemoveUserModal = ({ open, onOpenChange, user, propertyName }: TProps) => {
  const t = useTranslations("sharing");

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-[460px] gap-0 rounded-[10px] p-0 shadow-[0_20px_60px_rgba(9,9,11,0.18),0_4px_16px_rgba(9,9,11,0.10)] sm:max-w-[460px]"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4">
          <DialogTitle className="text-md font-semibold tracking-[-0.2px]">
            {t("removeModal.title")}
          </DialogTitle>
          <DialogClose className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent p-0">
            <X size={15} className="text-zinc-500" />
          </DialogClose>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {/* Icon */}
          <div className="mb-5 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-[14px] border border-[#fecaca] bg-[#fef2f2]">
              <UserMinus size={28} color="#dc2626" />
            </div>
          </div>

          {/* User preview */}
          <div className="mb-4 flex items-center gap-3 rounded-lg border border-zinc-200 bg-zinc-100 px-[14px] py-3">
            <Avatar size={36} idx={user.avatarIdx} name={user.name} />
            <div>
              <div className="text-sm font-semibold">{user.name}</div>
              <div className="text-xs text-zinc-500">
                {user.email} · {t(`roles.${user.role}`)}
              </div>
            </div>
          </div>

          {/* Confirmation text */}
          <p className="mb-[10px] text-sm leading-[1.55]">
            {t.rich("removeModal.body", {
              name: user.name,
              propertyName,
              strong: (chunks) => <strong>{chunks}</strong>,
            })}
          </p>

          {/* Sub-text */}
          <p className="text-sm leading-[1.55] text-zinc-500">{t("removeModal.subtext")}</p>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between border-t border-zinc-200 bg-zinc-50 px-6 py-3.5"
          style={{ borderRadius: "0 0 10px 10px" }}
        >
          <DialogClose className="inline-flex h-[34px] cursor-pointer items-center rounded-[6px] border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-950">
            {t("actions.cancel")}
          </DialogClose>
          {/* devnote: wire to Server Action when access management is implemented */}
          <button className="inline-flex h-[34px] cursor-pointer items-center rounded-[6px] border-0 bg-[#dc2626] px-4 text-sm font-medium text-white">
            {t("actions.removeAccess")}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

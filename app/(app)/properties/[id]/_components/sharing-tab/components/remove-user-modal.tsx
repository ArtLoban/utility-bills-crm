"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { UserMinus, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { errorMessage } from "@/lib/errors";
import { removePropertyAccess } from "@/features/sharing/actions";
import type { TPropertyMember } from "@/features/sharing/query";
import type { PropertyId } from "@/lib/db/schema/properties";
import { stableAvatarIdx, capitalizeRole } from "../utils";
import { Avatar } from "./avatar";

type TProps = {
  member: TPropertyMember;
  propertyId: string;
  propertyName: string;
};

export const RemoveUserModal = ({ member, propertyId, propertyName }: TProps) => {
  const router = useRouter();
  const t = useTranslations("sharing");
  const [isPending, startTransition] = useTransition();

  const avatarIdx = stableAvatarIdx(member.userId);
  const displayRole = capitalizeRole(member.role);
  const displayName = member.name ?? member.email;

  const handleConfirm = () => {
    startTransition(async () => {
      const result = await removePropertyAccess(propertyId as PropertyId, {
        targetUserId: member.userId,
      });

      if (!result.ok) {
        const msg = errorMessage(result.error);
        if (msg === "OWNER_PROTECTED") toast.error(t("errors.OWNER_PROTECTED"));
        else toast.error(t("removeModal.errors.generic"));
        return;
      }

      toast.success(t("toast.removeSuccess"));
      router.back();
    });
  };

  return (
    <Dialog open onOpenChange={(open) => !open && router.back()}>
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
            <Avatar size={36} idx={avatarIdx} name={displayName} />
            <div>
              <div className="text-sm font-semibold">{displayName}</div>
              <div className="text-xs text-zinc-500">
                {member.email} · {t(`roles.${displayRole}`)}
              </div>
            </div>
          </div>

          {/* Confirmation text */}
          <p className="mb-[10px] text-sm leading-[1.55]">
            {t.rich("removeModal.body", {
              name: displayName,
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
          <button
            onClick={handleConfirm}
            disabled={isPending}
            className={
              isPending
                ? "inline-flex h-[34px] cursor-default items-center rounded-[6px] border-0 bg-zinc-200 px-4 text-sm font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                : "inline-flex h-[34px] cursor-pointer items-center rounded-[6px] border-0 bg-[#dc2626] px-4 text-sm font-medium text-white"
            }
          >
            {isPending ? t("removeModal.removing") : t("actions.removeAccess")}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

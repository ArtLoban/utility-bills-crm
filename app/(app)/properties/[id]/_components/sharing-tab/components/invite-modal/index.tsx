"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { inviteToProperty } from "@/features/sharing/actions";
import type { PropertyId, TPropertyRole } from "@/lib/db/schema/properties";
import type { TUserRole } from "../../types";
import { InviteRadio } from "./components/invite-radio";

type TProps = { propertyId: string };

export const InviteModal = ({ propertyId }: TProps) => {
  const router = useRouter();
  const t = useTranslations("sharing");
  const [role, setRole] = useState<TUserRole>("Editor");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const canSubmit = email.trim() !== "" && !isPending;

  const handleSubmit = () => {
    setError(null);
    startTransition(async () => {
      const result = await inviteToProperty(propertyId as PropertyId, {
        email: email.trim(),
        role: role.toLowerCase() as TPropertyRole,
      });

      if (!result.ok) {
        const msg = result.error.message;
        if (msg === "USER_NOT_FOUND") {
          setError(t("inviteModal.errors.userNotFound"));
        } else if (msg === "ALREADY_HAS_ACCESS") {
          setError(t("inviteModal.errors.alreadyHasAccess"));
        } else {
          toast.error(t("inviteModal.errors.generic"));
        }
        return;
      }

      toast.success(t("toast.inviteSuccess"));
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
            {t("inviteModal.title")}
          </DialogTitle>
          <DialogClose className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent p-0">
            <X size={15} className="text-zinc-500" />
          </DialogClose>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {/* Email field */}
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              {t("inviteModal.emailLabel")}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null);
              }}
              placeholder={t("inviteModal.emailPlaceholder")}
              className="h-9 w-full rounded-[6px] border border-zinc-200 px-3 text-sm outline-none focus:border-[#7c3aed]"
            />
            {error ? (
              <p className="mt-[6px] text-xs" style={{ color: "#dc2626" }}>
                {error}
              </p>
            ) : (
              <p className="mt-[6px] text-xs text-zinc-500">{t("inviteModal.emailHint")}</p>
            )}
          </div>

          <div className="my-4 h-px bg-zinc-200" />

          {/* Role section */}
          <div>
            <p className="mb-[10px] text-sm font-medium">{t("inviteModal.roleLabel")}</p>
            <div className="flex flex-col gap-2">
              <InviteRadio
                value="Viewer"
                selected={role}
                onSelect={setRole}
                label={t("inviteModal.viewer.label")}
                helper={t("inviteModal.viewer.helper")}
              />
              <InviteRadio
                value="Editor"
                selected={role}
                onSelect={setRole}
                label={t("inviteModal.editor.label")}
                helper={t("inviteModal.editor.helper")}
              />
              <InviteRadio
                value="Owner"
                selected={role}
                onSelect={setRole}
                label={t("inviteModal.owner.label")}
                helper={t("inviteModal.owner.helper")}
              />
            </div>
          </div>
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
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={
              canSubmit
                ? "inline-flex h-[34px] cursor-pointer items-center rounded-[6px] border-0 bg-[#7c3aed] px-4 text-sm font-medium text-white"
                : "inline-flex h-[34px] cursor-default items-center rounded-[6px] border-0 bg-zinc-200 px-4 text-sm font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
            }
          >
            {isPending ? t("inviteModal.sending") : t("actions.sendInvite")}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

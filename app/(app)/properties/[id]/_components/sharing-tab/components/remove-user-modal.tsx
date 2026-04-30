"use client";

import { UserMinus, X } from "lucide-react";

import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { TSharedUser } from "../types";
import { Avatar } from "./avatar";

type TProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: TSharedUser | null;
};

export const RemoveUserModal = ({ open, onOpenChange, user }: TProps) => {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-[460px] gap-0 rounded-[10px] p-0 shadow-[0_20px_60px_rgba(9,9,11,0.18),0_4px_16px_rgba(9,9,11,0.10)] sm:max-w-[460px]"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4">
          <DialogTitle className="text-[15px] font-semibold tracking-[-0.2px]">
            Remove access?
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
              <div className="text-[14px] font-semibold">{user.name}</div>
              <div className="text-[12.5px] text-zinc-500">
                {user.email} · {user.role}
              </div>
            </div>
          </div>

          {/* Confirmation text */}
          {/* devnote: propertyName should come from props when connected to real data */}
          <p className="mb-[10px] text-[14px] leading-[1.55]">
            Remove <strong>{user.name}</strong> from <strong>Apartment on Main St</strong>?
          </p>

          {/* Sub-text */}
          <p className="text-[13.5px] leading-[1.55] text-zinc-500">
            They will immediately lose access to this property and all its data. This can be undone
            by inviting them again.
          </p>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between border-t border-zinc-200 bg-zinc-50 px-6 py-3.5"
          style={{ borderRadius: "0 0 10px 10px" }}
        >
          <DialogClose className="inline-flex h-[34px] cursor-pointer items-center rounded-[6px] border border-zinc-200 bg-white px-4 text-[13.5px] font-medium text-zinc-950">
            Cancel
          </DialogClose>
          {/* devnote: wire to Server Action when access management is implemented */}
          <button className="inline-flex h-[34px] cursor-pointer items-center rounded-[6px] border-0 bg-[#dc2626] px-4 text-[13.5px] font-medium text-white">
            Remove access
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

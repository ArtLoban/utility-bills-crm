"use client";

import { useState } from "react";
import { X } from "lucide-react";

import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { TUserRole } from "../../types";
import { InviteRadio } from "./components/invite-radio";

type TProps = { open: boolean; onOpenChange: (open: boolean) => void };

export const InviteModal = ({ open, onOpenChange }: TProps) => {
  const [role, setRole] = useState<TUserRole>("Editor");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-[460px] gap-0 rounded-[10px] p-0 shadow-[0_20px_60px_rgba(9,9,11,0.18),0_4px_16px_rgba(9,9,11,0.10)] sm:max-w-[460px]"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4">
          <DialogTitle className="text-[15px] font-semibold tracking-[-0.2px]">
            Invite person
          </DialogTitle>
          <DialogClose className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent p-0">
            <X size={15} className="text-zinc-500" />
          </DialogClose>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {/* Email field */}
          <div>
            <label className="mb-1.5 block text-[13.5px] font-medium">Email</label>
            <input
              type="email"
              placeholder="name@example.com"
              className="h-9 w-full rounded-[6px] border border-zinc-200 px-3 text-[14px] outline-none focus:border-[#7c3aed]"
            />
            <p className="mt-[6px] text-[12.5px] text-zinc-500">
              The person must already have an account.
            </p>
          </div>

          <div className="my-4 h-px bg-zinc-200" />

          {/* Role section */}
          <div>
            <p className="mb-[10px] text-[13.5px] font-medium">Role</p>
            <div className="flex flex-col gap-2">
              <InviteRadio
                value="Viewer"
                selected={role}
                onSelect={setRole}
                label="Viewer"
                helper="Can see everything, but can't make changes."
              />
              <InviteRadio
                value="Editor"
                selected={role}
                onSelect={setRole}
                label="Editor"
                helper="Can add readings, bills, and payments."
              />
              <InviteRadio
                value="Owner"
                selected={role}
                onSelect={setRole}
                label="Owner"
                helper="Full access, including inviting and removing others."
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between border-t border-zinc-200 bg-zinc-50 px-6 py-3.5"
          style={{ borderRadius: "0 0 10px 10px" }}
        >
          <DialogClose className="inline-flex h-[34px] cursor-pointer items-center rounded-[6px] border border-zinc-200 bg-white px-4 text-[13.5px] font-medium text-zinc-950">
            Cancel
          </DialogClose>
          {/* devnote: wire Send invite to Server Action when invitation logic is implemented */}
          <button className="inline-flex h-[34px] cursor-pointer items-center rounded-[6px] border-0 bg-[#7c3aed] px-4 text-[13.5px] font-medium text-white">
            Send invite
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

"use client";

import { AlertCircle, X } from "lucide-react";

import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";

type TProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  propertyName: string;
};

export const LastOwnerModal = ({ open, onOpenChange, propertyName }: TProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent
      showCloseButton={false}
      className="max-w-[460px] gap-0 rounded-[10px] p-0 shadow-[0_20px_60px_rgba(9,9,11,0.18),0_4px_16px_rgba(9,9,11,0.10)] sm:max-w-[460px]"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4">
        <DialogTitle className="text-md font-semibold tracking-[-0.2px]">
          Can&apos;t leave as the last owner
        </DialogTitle>
        <DialogClose className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent p-0">
          <X size={15} className="text-zinc-500" />
        </DialogClose>
      </div>

      {/* Body */}
      <div className="px-6 py-5">
        {/* Icon */}
        <div className="mb-5 flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-[14px] border border-[#fde68a] bg-[#fffbeb]">
            <AlertCircle size={28} color="#d97706" />
          </div>
        </div>

        {/* Main text */}
        <p className="mb-3 text-center text-sm leading-[1.55]">
          Every property needs at least one owner. You&apos;re currently the only owner of{" "}
          <strong>{propertyName}</strong>.
        </p>

        {/* Guidance label */}
        <p className="mb-[14px] text-center text-sm text-zinc-500">To leave, you can either:</p>

        {/* Numbered steps */}
        <div className="flex flex-col gap-2">
          {[
            "Promote someone else to Owner first, then leave.",
            "Delete the property if it's no longer needed.",
          ].map((text, i) => (
            <div
              key={i}
              className="flex flex-row gap-3 rounded-lg border border-zinc-200 bg-zinc-100 px-[14px] py-3"
            >
              <div className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-zinc-200 text-xs font-bold text-zinc-500">
                {i + 1}
              </div>
              <p className="m-0 text-sm leading-[1.5]">{text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div
        className="flex justify-end border-t border-zinc-200 bg-zinc-50 px-6 py-3.5"
        style={{ borderRadius: "0 0 10px 10px" }}
      >
        <DialogClose className="inline-flex h-[34px] cursor-pointer items-center rounded-[6px] border-0 bg-[#7c3aed] px-4 text-sm font-medium text-white">
          Got it
        </DialogClose>
      </div>
    </DialogContent>
  </Dialog>
);

"use client";

import { useState } from "react";
import { X } from "lucide-react";

import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ACCENT } from "@/lib/constants/ui-tokens";
import { RadioOption } from "./components/radio-option";
import { TariffForm } from "./components/tariff-form";

type TProps = { open: boolean; onOpenChange: (open: boolean) => void };

const UpdateContractModal = ({ open, onOpenChange }: TProps) => {
  const [selected, setSelected] = useState<string>("tariff");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-[520px] gap-0 rounded-[10px] p-0 shadow-[0_20px_60px_rgba(9,9,11,0.18),0_4px_16px_rgba(9,9,11,0.10)] sm:max-w-[520px]"
      >
        {/* Header */}
        <div
          className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800"
          style={{ padding: "16px 24px" }}
        >
          <DialogTitle style={{ fontSize: 15, fontWeight: 600, letterSpacing: -0.2, margin: 0 }}>
            Update contract
          </DialogTitle>
          <DialogClose className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent p-0">
            <X size={16} className="text-zinc-500 dark:text-zinc-400" />
          </DialogClose>
        </div>

        {/* Body */}
        <div style={{ padding: "20px 24px" }}>
          <p
            className="text-zinc-500 dark:text-zinc-400"
            style={{ fontSize: 13.5, marginBottom: 16 }}
          >
            What&apos;s changing?
          </p>
          <div className="flex flex-col gap-2">
            <RadioOption
              value="tariff"
              selected={selected}
              onSelect={setSelected}
              label="Tariff changed"
              helper="New rate or additional zones applied"
            >
              <TariffForm />
            </RadioOption>
            <RadioOption
              value="account"
              selected={selected}
              onSelect={setSelected}
              label="Account number changed"
              helper="Provider assigned a new account ID"
            />
            <RadioOption
              value="payment"
              selected={selected}
              onSelect={setSelected}
              label="Payment details changed"
              helper="New bank account or payment method"
            />
            <RadioOption
              value="provider"
              selected={selected}
              onSelect={setSelected}
              label="Provider changed"
              helper="Switched to a different energy supplier"
            />
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800/50"
          style={{ padding: "14px 24px", borderRadius: "0 0 10px 10px" }}
        >
          <DialogClose
            className="cursor-pointer rounded-md border border-zinc-200 bg-white px-4 text-[13.5px] font-medium text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
            style={{ height: 34 }}
          >
            Cancel
          </DialogClose>
          {/* devnote: wire Apply change to Server Action when contract update logic is implemented */}
          <button
            className="cursor-pointer rounded-md border-0 text-[13.5px] font-medium text-white"
            style={{ height: 34, padding: "0 18px", background: ACCENT }}
          >
            Apply change
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { UpdateContractModal };

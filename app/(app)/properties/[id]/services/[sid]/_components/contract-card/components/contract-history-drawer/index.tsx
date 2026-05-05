"use client";

import { X } from "lucide-react";

import { Sheet, SheetClose, SheetContent, SheetTitle } from "@/components/ui/sheet";
import type { TContractEra } from "../../../../_data/mock";
import { TimelineEntry } from "./components/timeline-entry";

type TProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  history: TContractEra[];
};

const ContractHistoryDrawer = ({ open, onOpenChange, history }: TProps) => (
  <Sheet open={open} onOpenChange={onOpenChange}>
    <SheetContent
      side="right"
      showCloseButton={false}
      className="flex w-[520px] max-w-[520px] flex-col p-0 sm:max-w-[520px]"
    >
      {/* Header */}
      <div
        className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800"
        style={{ padding: "16px 20px", flexShrink: 0 }}
      >
        <SheetTitle style={{ fontSize: 15, fontWeight: 600, letterSpacing: -0.2, margin: 0 }}>
          Contract history
        </SheetTitle>
        <SheetClose className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent p-0">
          <X size={16} className="text-zinc-500 dark:text-zinc-400" />
        </SheetClose>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto" style={{ padding: 20 }}>
        {history.map((entry, i) => (
          <TimelineEntry key={entry.id} entry={entry} isLast={i === history.length - 1} />
        ))}
      </div>

      {/* Footer */}
      <div
        className="flex items-center border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800/50"
        style={{ padding: "14px 20px", flexShrink: 0 }}
      >
        <button
          onClick={() => onOpenChange(false)}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-zinc-200 bg-white text-sm font-medium text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
          style={{ height: 32, padding: "0 12px" }}
        >
          Close
        </button>
      </div>
    </SheetContent>
  </Sheet>
);

export { ContractHistoryDrawer };

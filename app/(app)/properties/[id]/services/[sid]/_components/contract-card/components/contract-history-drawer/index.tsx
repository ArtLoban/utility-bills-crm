"use client";

import { X } from "lucide-react";

import { Sheet, SheetClose, SheetContent, SheetTitle } from "@/components/ui/sheet";
import type { TContractWithProvider } from "@/lib/db/access/contracts";
import type { TAttributeHistory } from "@/app/(app)/properties/[id]/services/[sid]/_data/queries";
import { TimelineEntry } from "./components/timeline-entry";

type TProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  history: TContractWithProvider[];
  attributeHistory: TAttributeHistory;
};

const ContractHistoryDrawer = ({ open, onOpenChange, history, attributeHistory }: TProps) => (
  <Sheet open={open} onOpenChange={onOpenChange}>
    <SheetContent
      side="right"
      showCloseButton={false}
      className="flex flex-col p-0"
      style={{ width: 520, maxWidth: 520 }}
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
        {history.length === 0 ? (
          <p className="text-zinc-500 dark:text-zinc-400" style={{ fontSize: 13.5 }}>
            No contract history yet.
          </p>
        ) : (
          history.map((item, i) => (
            <TimelineEntry
              key={item.contract.id}
              item={item}
              isLast={i === history.length - 1}
              tariffs={attributeHistory.tariffsByContract[item.contract.id] ?? []}
              accountNumbers={attributeHistory.accountNumbersByContract[item.contract.id] ?? []}
              paymentDetails={attributeHistory.paymentDetailsByContract[item.contract.id] ?? []}
            />
          ))
        )}
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

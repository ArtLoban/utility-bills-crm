"use client";

import { useState } from "react";
import { FileText, Gauge, Wallet } from "lucide-react";

import { ReadingModal } from "@/components/reading-modal";
import type { TMeter } from "@/components/reading-modal/types";
import { ACCENT } from "@/lib/constants/ui-tokens";

type TProps = { readingMeter: TMeter };

const QuickActions = ({ readingMeter }: TProps) => {
  const [readingOpen, setReadingOpen] = useState(false);

  // devnote: consider lifting ReadingModal state to page level if sync needed
  return (
    <>
      <div
        className="rounded-[8px] border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
        style={{ boxShadow: "0 1px 2px rgba(24,24,27,0.05)" }}
      >
        <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
          <span
            className="text-zinc-950 dark:text-zinc-50"
            style={{ fontSize: 13.5, fontWeight: 600, letterSpacing: -0.1 }}
          >
            Quick actions
          </span>
        </div>
        <div className="flex items-center gap-3 px-5 py-4">
          <button
            onClick={() => setReadingOpen(true)}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border-0 text-[13px] font-medium text-white"
            style={{ height: 32, padding: "0 14px", background: ACCENT }}
          >
            <Gauge size={13} />
            Submit reading
          </button>
          {/* devnote: wire to AddBillModal/RecordPaymentModal when implemented */}
          <button
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-zinc-200 bg-white text-[13px] font-medium text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
            style={{ height: 32, padding: "0 12px" }}
          >
            <FileText size={13} />
            Add bill
          </button>
          {/* devnote: wire to AddBillModal/RecordPaymentModal when implemented */}
          <button
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-zinc-200 bg-white text-[13px] font-medium text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
            style={{ height: 32, padding: "0 12px" }}
          >
            <Wallet size={13} />
            Record payment
          </button>
        </div>
      </div>

      <ReadingModal open={readingOpen} onOpenChange={setReadingOpen} meter={readingMeter} />
    </>
  );
};

export { QuickActions };

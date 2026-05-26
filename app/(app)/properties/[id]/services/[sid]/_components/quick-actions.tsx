"use client";

import { useState } from "react";
import { FileText, Gauge, Wallet } from "lucide-react";

import type { TMeter } from "@/lib/db/schema/meters";
import type { TServiceType } from "@/lib/db/schema/service-types";
import type { TReading } from "@/lib/db/schema/readings";
import { SubmitReadingModal } from "@/features/readings/components/submit-reading-modal";
import { ACCENT } from "@/lib/constants/ui-tokens";

type TProps = {
  meter: TMeter;
  serviceType: TServiceType;
  propertyName: string;
  lastReading: TReading | null;
};

const QuickActions = ({ meter, serviceType, propertyName, lastReading }: TProps) => {
  const [readingOpen, setReadingOpen] = useState(false);

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
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border-0 text-sm font-medium text-white"
            style={{ height: 32, padding: "0 14px", background: ACCENT }}
          >
            <Gauge size={13} />
            Submit reading
          </button>
          {/* devnote: wire to AddBillModal when implemented in Stage 6 */}
          <button
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-zinc-200 bg-white text-sm font-medium text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
            style={{ height: 32, padding: "0 12px" }}
          >
            <FileText size={13} />
            Add bill
          </button>
          {/* devnote: wire to RecordPaymentModal when implemented in Stage 6 */}
          <button
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-zinc-200 bg-white text-sm font-medium text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
            style={{ height: 32, padding: "0 12px" }}
          >
            <Wallet size={13} />
            Record payment
          </button>
        </div>
      </div>

      <SubmitReadingModal
        open={readingOpen}
        onOpenChange={setReadingOpen}
        meter={meter}
        serviceType={serviceType}
        propertyName={propertyName}
        lastReading={lastReading}
      />
    </>
  );
};

export { QuickActions };

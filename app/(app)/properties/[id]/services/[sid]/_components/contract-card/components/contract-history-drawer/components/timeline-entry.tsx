import { format } from "date-fns";

import { cn } from "@/lib/utils";
import type { TContractWithProvider } from "@/lib/db/access/contracts";

type TProps = { item: TContractWithProvider; isLast: boolean };

const formatRange = (validFrom: Date, validTo: Date | null): string => {
  const from = format(validFrom, "MMM d, yyyy");
  const to = validTo ? format(validTo, "MMM d, yyyy") : "present";
  return `${from} — ${to}`;
};

const TimelineEntry = ({ item, isLast }: TProps) => {
  const { contract, provider } = item;
  const isCurrent = contract.validTo === null;

  return (
    <div className="flex">
      {/* Left column: dot + line */}
      <div className="flex flex-col items-center" style={{ width: 28, flexShrink: 0 }}>
        <div
          className={cn("shrink-0", isCurrent ? "bg-violet-600" : "bg-zinc-300 dark:bg-zinc-600")}
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            boxShadow: isCurrent ? "0 0 0 3px #f5f3ff" : "none",
            marginTop: 14,
          }}
        />
        {!isLast && (
          <div
            className="flex-1 dark:bg-zinc-700"
            style={{ width: 2, background: "#e4e4e7", marginTop: 6 }}
          />
        )}
      </div>

      {/* Right card */}
      <div
        className={cn(
          "flex-1 overflow-hidden rounded-[8px] border",
          isCurrent
            ? "border-[#ede9fe] bg-[#f5f3ff80] dark:border-violet-900/40 dark:bg-violet-950/10"
            : "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900",
        )}
        style={{ marginLeft: 12, marginBottom: isLast ? 0 : 20 }}
      >
        {/* Card header */}
        <div
          className={cn(
            "flex items-center justify-between border-b",
            isCurrent
              ? "border-[#ede9fe] bg-[#f5f3ff] dark:border-violet-900/40 dark:bg-violet-950/20"
              : "border-zinc-100 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800/50",
          )}
          style={{ padding: "12px 16px" }}
        >
          <span
            className="text-zinc-950 dark:text-zinc-50"
            style={{ fontSize: 13, fontWeight: 600 }}
          >
            {formatRange(contract.validFrom, contract.validTo)}
          </span>
          {isCurrent && (
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                background: "#7c3aed",
                color: "#ffffff",
                padding: "2px 8px",
                borderRadius: 999,
              }}
            >
              Current
            </span>
          )}
        </div>

        {/* Card body */}
        <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
          {/* Provider */}
          <div className="flex items-start gap-2">
            <span
              className="text-zinc-500 dark:text-zinc-400"
              style={{ fontSize: 12, minWidth: 120 }}
            >
              Provider
            </span>
            <span className="text-zinc-950 dark:text-zinc-50" style={{ fontSize: 13 }}>
              {provider.name}
            </span>
          </div>

          {/* Notes */}
          {contract.notes && (
            <div className="flex items-start gap-2">
              <span
                className="text-zinc-500 dark:text-zinc-400"
                style={{ fontSize: 12, minWidth: 120 }}
              >
                Notes
              </span>
              <span
                className="whitespace-pre-wrap text-zinc-950 dark:text-zinc-50"
                style={{ fontSize: 13 }}
              >
                {contract.notes}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export { TimelineEntry };

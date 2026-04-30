import { Receipt, Wallet } from "lucide-react";

import { DESTRUCTIVE } from "@/lib/constants/ui-tokens";
import { cn } from "@/lib/utils";

type TProps = { balance: number };

const BalanceCard = ({ balance }: TProps) => {
  const isDebt = balance < 0;
  const absAmount = Math.abs(balance);
  const [intPart, fracPart] = absAmount.toFixed(2).split(".");

  return (
    <div
      className="rounded-[8px] border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
      style={{
        boxShadow: "0 1px 2px rgba(24,24,27,0.05)",
        padding: "24px 24px 20px",
      }}
    >
      <div
        className="text-zinc-500 dark:text-zinc-400"
        style={{
          fontSize: 12,
          fontWeight: 500,
          textTransform: "uppercase",
          letterSpacing: 0.3,
          marginBottom: 8,
        }}
      >
        Current balance
      </div>

      <div className="mb-2 flex items-baseline gap-1">
        <span
          className={cn(isDebt ? "" : "text-zinc-950 dark:text-zinc-50")}
          style={{
            fontSize: 42,
            fontWeight: 700,
            letterSpacing: -1.2,
            fontFeatureSettings: '"tnum" 1',
            color: isDebt ? DESTRUCTIVE : undefined,
            lineHeight: 1,
          }}
        >
          {isDebt ? "−" : "+"}
          {intPart}.{fracPart}
        </span>
        <span
          style={{
            fontSize: 22,
            fontWeight: 500,
            color: isDebt ? DESTRUCTIVE : undefined,
          }}
          className={cn(!isDebt && "text-zinc-950 dark:text-zinc-50")}
        >
          ₴
        </span>
      </div>

      <p className="mb-5 text-zinc-500 dark:text-zinc-400" style={{ fontSize: 13.5 }}>
        {isDebt ? (
          <>
            Debt of{" "}
            <span style={{ color: DESTRUCTIVE, fontWeight: 500 }}>
              {absAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })} ₴
            </span>{" "}
            outstanding
          </>
        ) : (
          "No outstanding debt"
        )}
      </p>

      <div className="flex items-center gap-2">
        {/* devnote: wire navigation when per-service filtering is supported */}
        <button
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-zinc-200 bg-white text-[13px] font-medium text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
          style={{ height: 32, padding: "0 12px" }}
        >
          <Receipt size={13} />
          View all bills
        </button>
        {/* devnote: wire navigation when per-service filtering is supported */}
        <button
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-zinc-200 bg-white text-[13px] font-medium text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
          style={{ height: 32, padding: "0 12px" }}
        >
          <Wallet size={13} />
          View all payments
        </button>
      </div>
    </div>
  );
};

export { BalanceCard };

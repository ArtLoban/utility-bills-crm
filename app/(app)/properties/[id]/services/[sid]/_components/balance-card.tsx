import { Wallet } from "lucide-react";

import { formatUAH } from "@/lib/format/currency";
import type { TBalance } from "@/features/ledger";

type TProps = {
  balance: TBalance;
};

const BalanceCard = ({ balance }: TProps) => {
  const isEmpty = balance.billsTotal === 0 && balance.paymentsTotal === 0;

  return (
    <div
      className="rounded-[8px] border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
      style={{ boxShadow: "0 1px 2px rgba(24,24,27,0.05)" }}
    >
      <div className="flex items-center border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
        <span
          className="text-zinc-950 dark:text-zinc-50"
          style={{ fontSize: 13.5, fontWeight: 600, letterSpacing: -0.1 }}
        >
          Balance
        </span>
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center gap-3 px-6 py-10">
          <Wallet size={28} className="text-zinc-300 dark:text-zinc-600" />
          <p className="text-zinc-500 dark:text-zinc-400" style={{ fontSize: 13.5 }}>
            No bills or payments yet.
          </p>
        </div>
      ) : (
        <div className="px-5 py-5">
          <p
            className={`mb-5 font-bold tracking-[-0.5px] tabular-nums ${
              balance.balance > 0
                ? "text-destructive"
                : balance.balance < 0
                  ? "text-green-600 dark:text-green-500"
                  : "text-zinc-950 dark:text-zinc-50"
            }`}
            style={{ fontSize: 28 }}
          >
            {formatUAH(Math.abs(balance.balance))}
          </p>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-zinc-500 dark:text-zinc-400" style={{ fontSize: 13 }}>
                Billed
              </span>
              <span
                className="text-zinc-950 tabular-nums dark:text-zinc-50"
                style={{ fontSize: 13, fontWeight: 500 }}
              >
                {formatUAH(balance.billsTotal)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-500 dark:text-zinc-400" style={{ fontSize: 13 }}>
                Paid
              </span>
              <span
                className="text-green-600 tabular-nums dark:text-green-500"
                style={{ fontSize: 13, fontWeight: 500 }}
              >
                {formatUAH(balance.paymentsTotal)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { BalanceCard };

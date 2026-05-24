import { Wallet } from "lucide-react";

const BalanceCard = () => (
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
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-10">
      <Wallet size={28} className="text-zinc-300 dark:text-zinc-600" />
      <p className="text-zinc-500 dark:text-zinc-400" style={{ fontSize: 13.5 }}>
        No bills or payments yet.
      </p>
    </div>
  </div>
);

export { BalanceCard };

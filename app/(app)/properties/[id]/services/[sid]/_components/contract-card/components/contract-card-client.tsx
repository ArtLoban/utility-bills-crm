"use client";

import { useState } from "react";
import { History } from "lucide-react";

import type { TContractWithProvider } from "@/lib/db/access/contracts";
import { ContractHistoryDrawer } from "./contract-history-drawer";

type TProps = {
  contractHistory: TContractWithProvider[];
};

const ContractCardClient = ({ contractHistory }: TProps) => {
  const [historyOpen, setHistoryOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setHistoryOpen(true)}
        className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-zinc-200 bg-white text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700/60"
        style={{ height: 32, padding: "0 12px" }}
      >
        <History size={14} />
        View history
      </button>

      <ContractHistoryDrawer
        open={historyOpen}
        onOpenChange={setHistoryOpen}
        history={contractHistory}
      />
    </>
  );
};

export { ContractCardClient };

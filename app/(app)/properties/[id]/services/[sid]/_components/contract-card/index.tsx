"use client";

import { useState } from "react";

import { ACCENT } from "@/lib/constants/ui-tokens";
import { KVGrid } from "../kv-grid";
import type { TContractEra, TContractInfo } from "../../_data/mock";
import { TariffRateChips } from "./components/tariff-rate-chips";
import { UpdateContractModal } from "./components/update-contract-modal";
import { ContractHistoryDrawer } from "./components/contract-history-drawer";

type TProps = { contract: TContractInfo; history: TContractEra[] };

const ContractCard = ({ contract, history }: TProps) => {
  const [updateOpen, setUpdateOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  return (
    <>
      <div
        className="rounded-[8px] border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
        style={{ boxShadow: "0 1px 2px rgba(24,24,27,0.05)" }}
      >
        {/* Card header */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
          <span
            className="text-zinc-950 dark:text-zinc-50"
            style={{ fontSize: 13.5, fontWeight: 600, letterSpacing: -0.1 }}
          >
            Current contract
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setUpdateOpen(true)}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border-0 text-sm font-medium text-white"
              style={{ height: 32, padding: "0 14px", background: ACCENT }}
            >
              Update contract
            </button>
            <button
              onClick={() => setHistoryOpen(true)}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border-0 bg-transparent text-sm font-medium text-zinc-500"
              style={{ height: 32, padding: "0 10px" }}
            >
              View history
            </button>
          </div>
        </div>

        {/* Card body */}
        <div
          style={{
            padding: "20px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          <KVGrid
            pairs={[
              ["Provider", contract.provider],
              ["In effect since", contract.inEffectSince],
              ["Account number", contract.accountNumber],
              ["Tariff type", contract.tariffType],
            ]}
          />

          {/* Tariff rates */}
          <div>
            <div
              className="text-zinc-500 dark:text-zinc-400"
              style={{
                fontSize: 11.5,
                textTransform: "uppercase",
                fontWeight: 500,
                letterSpacing: 0.3,
                marginBottom: 10,
              }}
            >
              Tariff rates
            </div>
            <TariffRateChips rates={contract.tariffRates} />
          </div>

          {/* Payment details */}
          <div>
            <div
              className="text-zinc-500 dark:text-zinc-400"
              style={{
                fontSize: 11.5,
                textTransform: "uppercase",
                fontWeight: 500,
                letterSpacing: 0.3,
                marginBottom: 10,
              }}
            >
              Payment details
            </div>
            <pre
              className="rounded-md border border-zinc-200 bg-zinc-100 text-zinc-950 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
              style={{
                padding: "10px 12px",
                fontSize: 12.5,
                lineHeight: 1.6,
                fontFamily: 'ui-monospace, "Cascadia Code", "Fira Code", monospace',
                whiteSpace: "pre-wrap",
                margin: 0,
              }}
            >
              {contract.paymentDetails}
            </pre>
          </div>
        </div>
      </div>

      <UpdateContractModal open={updateOpen} onOpenChange={setUpdateOpen} />
      <ContractHistoryDrawer open={historyOpen} onOpenChange={setHistoryOpen} history={history} />
    </>
  );
};

export { ContractCard };

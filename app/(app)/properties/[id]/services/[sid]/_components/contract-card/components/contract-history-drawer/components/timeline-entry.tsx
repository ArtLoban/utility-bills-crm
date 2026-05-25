import { format } from "date-fns";

import { cn } from "@/lib/utils";
import type { TContractWithProvider } from "@/lib/db/access/contracts";
import type { TTariff } from "@/lib/db/schema/tariffs";
import type { TAccountNumber } from "@/lib/db/schema/account-numbers";
import type { TPaymentDetails } from "@/lib/db/schema/payment-details";

type TProps = {
  item: TContractWithProvider;
  isLast: boolean;
  tariffs: TTariff[];
  accountNumbers: TAccountNumber[];
  paymentDetails: TPaymentDetails[];
};

const formatRange = (validFrom: Date, validTo: Date | null): string => {
  const from = format(validFrom, "MMM d, yyyy");
  const to = validTo ? format(validTo, "MMM d, yyyy") : "present";
  return `${from} — ${to}`;
};

const formatTariff = (tariff: TTariff): string => {
  if (tariff.fixedAmount !== null) return `Fixed: ${tariff.fixedAmount} ₴/mo`;
  const parts = [`T1: ${tariff.rateT1}`];
  if (tariff.rateT2) parts.push(`T2: ${tariff.rateT2}`);
  if (tariff.rateT3) parts.push(`T3: ${tariff.rateT3}`);
  return parts.join(" · ");
};

const NestedRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-start gap-2">
    <span className="text-zinc-500 dark:text-zinc-400" style={{ fontSize: 12, minWidth: 110 }}>
      {label}
    </span>
    <span className="break-all text-zinc-950 dark:text-zinc-50" style={{ fontSize: 12.5 }}>
      {value}
    </span>
  </div>
);

const TimelineEntry = ({ item, isLast, tariffs, accountNumbers, paymentDetails }: TProps) => {
  const { contract, provider } = item;
  const isCurrent = contract.validTo === null;
  const hasAttributes =
    tariffs.length > 0 || accountNumbers.length > 0 || paymentDetails.length > 0;

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
          <NestedRow label="Provider" value={provider.name} />

          {/* Contract notes */}
          {contract.notes && <NestedRow label="Notes" value={contract.notes} />}

          {/* Nested attribute history */}
          {hasAttributes && (
            <div
              className="mt-1 flex flex-col gap-2 rounded-[6px] border border-zinc-100 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800/40"
              style={{ padding: "10px 12px" }}
            >
              {/* Tariffs */}
              {tariffs.length > 0 && (
                <div>
                  <p
                    className="mb-1.5 text-zinc-400 dark:text-zinc-500"
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: 0.3,
                    }}
                  >
                    Tariff periods
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {tariffs.map((t) => (
                      <div key={t.id} className="flex items-start gap-2">
                        <span
                          className="text-zinc-400 dark:text-zinc-500"
                          style={{ fontSize: 11.5, minWidth: 130 }}
                        >
                          {formatRange(t.validFrom, t.validTo)}
                        </span>
                        <span
                          className="text-zinc-700 dark:text-zinc-300"
                          style={{ fontSize: 11.5, fontFeatureSettings: '"tnum" 1' }}
                        >
                          {formatTariff(t)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Account numbers */}
              {accountNumbers.length > 0 && (
                <div>
                  <p
                    className="mb-1.5 text-zinc-400 dark:text-zinc-500"
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: 0.3,
                    }}
                  >
                    Account numbers
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {accountNumbers.map((a) => (
                      <div key={a.id} className="flex items-start gap-2">
                        <span
                          className="text-zinc-400 dark:text-zinc-500"
                          style={{ fontSize: 11.5, minWidth: 130 }}
                        >
                          {formatRange(a.validFrom, a.validTo)}
                        </span>
                        <span
                          className="break-all text-zinc-700 dark:text-zinc-300"
                          style={{ fontSize: 11.5, fontFeatureSettings: '"tnum" 1' }}
                        >
                          {a.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Payment details */}
              {paymentDetails.length > 0 && (
                <div>
                  <p
                    className="mb-1.5 text-zinc-400 dark:text-zinc-500"
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: 0.3,
                    }}
                  >
                    Payment details
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {paymentDetails.map((pd) => (
                      <div key={pd.id} className="flex items-start gap-2">
                        <span
                          className="text-zinc-400 dark:text-zinc-500"
                          style={{ fontSize: 11.5, minWidth: 130 }}
                        >
                          {formatRange(pd.validFrom, pd.validTo)}
                        </span>
                        <span
                          className="break-all whitespace-pre-wrap text-zinc-700 dark:text-zinc-300"
                          style={{
                            fontSize: 11.5,
                            fontFamily: 'ui-monospace, "Fira Code", monospace',
                          }}
                        >
                          {pd.details}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export { TimelineEntry };

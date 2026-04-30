import { cn } from "@/lib/utils";
import type { TContractEra } from "../../../../../_data/mock";

type TProps = { entry: TContractEra; isLast: boolean };

const TimelineEntry = ({ entry, isLast }: TProps) => {
  const isCurrentCard = entry.isCurrent;

  return (
    <div className="flex">
      {/* Left column: dot + line */}
      <div className="flex flex-col items-center" style={{ width: 28, flexShrink: 0 }}>
        <div
          className={cn(
            "shrink-0",
            isCurrentCard ? "bg-violet-600" : "bg-zinc-300 dark:bg-zinc-600",
          )}
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            boxShadow: isCurrentCard ? "0 0 0 3px #f5f3ff" : "none",
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
          isCurrentCard
            ? "border-[#ede9fe] bg-[#f5f3ff80] dark:border-violet-900/40 dark:bg-violet-950/10"
            : "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900",
        )}
        style={{ marginLeft: 12, marginBottom: isLast ? 0 : 20 }}
      >
        {/* Card header */}
        <div
          className={cn(
            "flex items-center justify-between border-b",
            isCurrentCard
              ? "border-[#ede9fe] bg-[#f5f3ff] dark:border-violet-900/40 dark:bg-violet-950/20"
              : "border-zinc-100 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800/50",
          )}
          style={{ padding: "12px 16px" }}
        >
          <span
            className="text-zinc-950 dark:text-zinc-50"
            style={{ fontSize: 13, fontWeight: 600 }}
          >
            {entry.range}
          </span>
          {isCurrentCard && (
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
        <div
          style={{
            padding: "14px 16px",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {/* Provider */}
          <div className="flex items-start gap-2">
            <span
              className="text-zinc-500 dark:text-zinc-400"
              style={{ fontSize: 12, minWidth: 120 }}
            >
              Provider
            </span>
            <span className="text-zinc-950 dark:text-zinc-50" style={{ fontSize: 13 }}>
              {entry.provider}
            </span>
          </div>

          {/* Account */}
          <div className="flex items-start gap-2">
            <span
              className="text-zinc-500 dark:text-zinc-400"
              style={{ fontSize: 12, minWidth: 120 }}
            >
              Account
            </span>
            <span className="text-zinc-950 dark:text-zinc-50" style={{ fontSize: 13 }}>
              {entry.accountNumber}
            </span>
          </div>

          {/* Tariff periods */}
          <div>
            <div
              className="text-zinc-500 dark:text-zinc-400"
              style={{
                fontSize: 11.5,
                textTransform: "uppercase",
                fontWeight: 500,
                letterSpacing: 0.3,
                marginBottom: 6,
              }}
            >
              Tariff history
            </div>
            <div className="flex flex-col gap-2">
              {entry.tariffs.map((period, i) => (
                <div
                  key={i}
                  className="border-l-2 border-zinc-200 dark:border-zinc-700"
                  style={{ marginLeft: 12, paddingLeft: 12 }}
                >
                  <div
                    className="text-zinc-500 dark:text-zinc-400"
                    style={{ fontSize: 12, marginBottom: 3 }}
                  >
                    {period.range}
                  </div>
                  <div
                    className="text-zinc-950 dark:text-zinc-50"
                    style={{ fontSize: 13, fontWeight: 500, fontFeatureSettings: '"tnum" 1' }}
                  >
                    {period.t2 ? `${period.t1} (T1 day) / ${period.t2} (T2 night)` : period.t1}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment details */}
          <div className="flex items-start gap-2">
            <span
              className="text-zinc-500 dark:text-zinc-400"
              style={{ fontSize: 12, minWidth: 120 }}
            >
              Payment
            </span>
            <span className="text-zinc-950 dark:text-zinc-50" style={{ fontSize: 13 }}>
              {entry.paymentDetails}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export { TimelineEntry };

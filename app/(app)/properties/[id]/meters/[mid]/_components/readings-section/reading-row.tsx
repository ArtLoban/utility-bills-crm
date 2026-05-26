"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";

import type { TReading } from "@/lib/db/schema/readings";
import type { TMeter } from "@/lib/db/schema/meters";
import type { TServiceType } from "@/lib/db/schema/service-types";
import { SubmitReadingModal } from "@/features/readings/components/submit-reading-modal";

type TProps = {
  reading: TReading;
  meter: TMeter;
  serviceType: TServiceType;
  propertyName: string;
  lastReadingBeforeThis: TReading | null;
  isLast: boolean;
  canMutate: boolean;
};

const formatValue = (v: string | null): string => {
  if (v === null) return "—";
  const n = parseFloat(v);
  return n.toLocaleString("en-US", { maximumFractionDigits: 3 });
};

const ReadingRow = ({
  reading,
  meter,
  serviceType,
  propertyName,
  lastReadingBeforeThis,
  isLast,
  canMutate,
}: TProps) => {
  const [editOpen, setEditOpen] = useState(false);

  const tdBorderClass = isLast ? "" : "border-b border-zinc-200 dark:border-zinc-800";
  const tdStyle: React.CSSProperties = { padding: "11px 16px", fontSize: 13.5 };

  const dateStr = new Date(reading.readAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <>
      <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
        <td className={`${tdBorderClass} text-zinc-700 dark:text-zinc-300`} style={tdStyle}>
          {dateStr}
        </td>
        <td
          className={`${tdBorderClass} text-zinc-950 dark:text-zinc-50`}
          style={{ ...tdStyle, fontVariantNumeric: "tabular-nums" }}
        >
          {formatValue(reading.valueT1)}
        </td>
        {meter.zoneCount >= 2 && (
          <td
            className={`${tdBorderClass} text-zinc-950 dark:text-zinc-50`}
            style={{ ...tdStyle, fontVariantNumeric: "tabular-nums" }}
          >
            {formatValue(reading.valueT2)}
          </td>
        )}
        {meter.zoneCount === 3 && (
          <td
            className={`${tdBorderClass} text-zinc-950 dark:text-zinc-50`}
            style={{ ...tdStyle, fontVariantNumeric: "tabular-nums" }}
          >
            {formatValue(reading.valueT3)}
          </td>
        )}
        {reading.notes && (
          <td
            className={`${tdBorderClass} max-w-[200px] truncate text-zinc-500 dark:text-zinc-400`}
            style={{ ...tdStyle, fontSize: 13 }}
          >
            {reading.notes}
          </td>
        )}
        {!reading.notes && <td className={tdBorderClass} style={tdStyle} />}
        <td className={tdBorderClass} style={{ ...tdStyle, width: 40, textAlign: "right" }}>
          {canMutate && (
            <button
              onClick={() => setEditOpen(true)}
              className="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
              style={{ padding: 0 }}
            >
              <Pencil size={13} strokeWidth={1.75} />
            </button>
          )}
        </td>
      </tr>

      {canMutate && (
        <SubmitReadingModal
          open={editOpen}
          onOpenChange={setEditOpen}
          meter={meter}
          serviceType={serviceType}
          propertyName={propertyName}
          lastReading={lastReadingBeforeThis}
          reading={reading}
        />
      )}
    </>
  );
};

export { ReadingRow };

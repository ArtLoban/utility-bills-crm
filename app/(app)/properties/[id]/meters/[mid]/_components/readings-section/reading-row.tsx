"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";

import type { TReading } from "@/lib/db/schema/readings";
import type { TMeter } from "@/lib/db/schema/meters";
import type { TServiceType } from "@/lib/db/schema/service-types";
import { SubmitReadingModal } from "@/features/readings/components/submit-reading-modal";
import { formatReadingValue } from "@/features/readings/format";
import { formatDisplayDate } from "@/lib/format/date";

type TProps = {
  reading: TReading;
  meter: TMeter;
  serviceType: TServiceType;
  propertyName: string;
  lastReadingBeforeThis: TReading | null;
  isLast: boolean;
  canMutate: boolean;
};

export const ReadingRow = ({
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
  const tdClass = `${tdBorderClass} px-4 py-2.5 text-sm`;
  const valueTdClass = `${tdClass} tabular-nums text-zinc-950 dark:text-zinc-50`;

  return (
    <>
      <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
        <td className={`${tdClass} text-zinc-700 dark:text-zinc-300`}>
          {formatDisplayDate(reading.readAt)}
        </td>
        <td className={valueTdClass}>{formatReadingValue(reading.valueT1)}</td>
        {meter.zoneCount >= 2 && (
          <td className={valueTdClass}>{formatReadingValue(reading.valueT2)}</td>
        )}
        {meter.zoneCount === 3 && (
          <td className={valueTdClass}>{formatReadingValue(reading.valueT3)}</td>
        )}
        {reading.notes && (
          <td className={`${tdClass} max-w-48 truncate text-zinc-500 dark:text-zinc-400`}>
            {reading.notes}
          </td>
        )}
        {!reading.notes && <td className={tdClass} />}
        <td className={`${tdClass} w-10 text-right`}>
          {canMutate && (
            <button
              onClick={() => setEditOpen(true)}
              className="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent p-0 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
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

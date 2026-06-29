"use client";

import { useTranslations } from "next-intl";

import { formatReadingValue } from "@/features/readings/format";
import { formatDisplayDate } from "@/lib/format/date";
import { UNIT_LABELS } from "@/lib/constants/zones";
import type { TMeter } from "@/lib/db/schema/meters";
import type { TReading } from "@/lib/db/schema/readings";
import type { TServiceType } from "@/lib/db/schema/service-types";

import { ReadingRowActions } from "../../reading-row-actions";

type TProps = {
  reading: TReading;
  meter: TMeter;
  serviceType: TServiceType;
  canMutate: boolean;
};

type TZoneEntry = {
  label: string | null;
  value: string | null;
};

export const ReadingCard = ({ reading, meter, serviceType, canMutate }: TProps) => {
  const t = useTranslations("meters.detail");
  const unitLabel = serviceType.unit ? UNIT_LABELS[serviceType.unit] : "";

  const zones: TZoneEntry[] =
    meter.zoneCount === 1
      ? [{ label: null, value: reading.valueT1 }]
      : [
          { label: t("series.t1"), value: reading.valueT1 },
          { label: t("series.t2"), value: reading.valueT2 },
        ];

  if (meter.zoneCount === 3) zones.push({ label: t("series.t3"), value: reading.valueT3 });

  return (
    <div className="border-border bg-card flex items-center gap-2 rounded-lg border py-3 pr-2.5 pl-3.5 shadow-sm">
      <div className="min-w-0 flex-1 text-sm">
        <span className="font-semibold tracking-tight tabular-nums">
          {formatDisplayDate(reading.readAt)}
        </span>

        <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1">
          {zones.map(({ label, value }) => (
            <span key={label ?? "value"} className="text-muted-foreground">
              {label && `${label}: `}
              <span className="text-foreground tabular-nums">{formatReadingValue(value)}</span>
              {unitLabel && ` ${unitLabel}`}
            </span>
          ))}
        </div>

        {reading.notes && (
          <div className="text-muted-foreground mt-1 truncate">{reading.notes}</div>
        )}
      </div>

      <ReadingRowActions reading={reading} meter={meter} canMutate={canMutate} />
    </div>
  );
};

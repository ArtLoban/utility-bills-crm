import { useTranslations } from "next-intl";

import type { TReading } from "@/lib/db/schema/readings";
import { formatDisplayDate } from "@/lib/format/date";
import { formatReadingZones } from "@/features/readings/format";

type TProps = {
  lastReading: TReading | null;
  zoneCount: number;
};

export const LastReadingCell = ({ lastReading, zoneCount }: TProps) => {
  const t = useTranslations("meters.list");

  if (!lastReading) {
    return <span className="text-muted-foreground">{t("lastReading.none")}</span>;
  }

  return (
    <span className="text-muted-foreground text-sm tabular-nums">
      {formatDisplayDate(lastReading.readAt)}
      <span className="px-1">·</span>
      {formatReadingZones(lastReading, zoneCount)}
    </span>
  );
};

import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import type { TReading } from "@/lib/db/schema/readings";
import { formatDisplayDate } from "@/lib/format/date";
import { formatReadingZones } from "@/features/readings/format";

type TProps = {
  lastReading: TReading | null;
  zoneCount: number;
  tone?: "default" | "muted";
};

export const LastReadingCell = ({ lastReading, zoneCount, tone = "default" }: TProps) => {
  const t = useTranslations("meters.list");

  if (!lastReading) {
    return <span className="text-muted-foreground">{t("lastReading.none")}</span>;
  }

  return (
    <span className={cn("tabular-nums", tone === "muted" && "text-muted-foreground text-sm")}>
      {formatDisplayDate(lastReading.readAt)}
      <span className="px-1">·</span>
      {formatReadingZones(lastReading, zoneCount)}
    </span>
  );
};

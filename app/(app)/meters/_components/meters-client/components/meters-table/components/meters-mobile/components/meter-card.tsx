"use client";

import { useTranslations } from "next-intl";

import { IconBadge } from "@/components/icon-badge";
import { Surface } from "@/components/surface";
import { Badge } from "@/components/ui/badge";
import type { TMeterGlobalRow } from "@/lib/db/access/meters";
import { useServiceTypeMeta } from "@/features/services/hooks/use-service-type";

import { MeterRowActions } from "../../meter-row-actions";
import { LastReadingCell } from "../../last-reading-cell";

type TProps = {
  row: TMeterGlobalRow;
  showHistoricalBadge: boolean;
};

export const MeterCard = ({ row, showHistoricalBadge }: TProps) => {
  const t = useTranslations("meters.list");
  const { color, Icon, label } = useServiceTypeMeta(row.serviceType.code);
  const isHistorical = row.meter.validTo !== null;

  return (
    <Surface elevation="sm" className="flex items-center gap-2 py-3 pr-2.5 pl-3.5">
      <div className="min-w-0 flex-1 text-sm">
        <div className="flex items-center gap-2">
          <IconBadge icon={Icon} color={color} size="sm" />
          <span className="min-w-0 flex-1 truncate font-semibold tracking-tight">{label}</span>
          {showHistoricalBadge && isHistorical && <Badge>{t("badge.historical")}</Badge>}
          <span className="text-muted-foreground shrink-0 text-xs">
            {t("zones.count", { count: row.meter.zoneCount })}
          </span>
        </div>

        <div className="mt-1.5 truncate">{row.property.name}</div>

        <div className="text-muted-foreground mt-1 flex items-center justify-between gap-8 text-xs">
          <span className="shrink-0">{t("columns.serial")}</span>
          <span className="min-w-0 truncate font-mono">{row.meter.serialNumber ?? "—"}</span>
        </div>

        <div className="mt-1">
          <LastReadingCell
            lastReading={row.lastReading}
            zoneCount={row.meter.zoneCount}
            tone="muted"
          />
        </div>
      </div>

      <MeterRowActions row={row} />
    </Surface>
  );
};

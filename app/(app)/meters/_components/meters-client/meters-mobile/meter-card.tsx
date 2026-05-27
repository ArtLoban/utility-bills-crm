import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { TMeterGlobalRow } from "@/lib/db/access/meters";
import { getServiceTypeVisuals, TServiceTypeCode } from "@/features/services/service-type";

type TProps = {
  row: TMeterGlobalRow;
  showHistoricalBadge: boolean;
};

const MeterCard = ({ row, showHistoricalBadge }: TProps) => {
  const router = useRouter();
  const t = useTranslations("meters.list");

  const { color, Icon } = getServiceTypeVisuals(row.serviceType.code as TServiceTypeCode);
  const isHistorical = row.meter.validTo !== null;
  const detailHref = `/properties/${row.property.id}/meters/${row.meter.id}`;

  const serviceLabel = row.serviceType.code
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div
      className="border border-zinc-200 bg-white shadow-[0_1px_2px_rgba(24,24,27,0.04)] dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none"
      style={{ borderRadius: 8, padding: 14, display: "flex", alignItems: "center", gap: 12 }}
      onClick={() => router.push(detailHref)}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          background: color + "18",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={18} style={{ color }} strokeWidth={1.75} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            gap: 8,
          }}
        >
          <span
            style={{
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: -0.1,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {row.property.name}
            {showHistoricalBadge && isHistorical && (
              <span
                className="bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                style={{
                  fontSize: 10,
                  fontWeight: 500,
                  padding: "1px 5px",
                  borderRadius: 3,
                  marginLeft: 6,
                }}
              >
                {t("badge.historical")}
              </span>
            )}
          </span>
          <span
            className="text-zinc-500 dark:text-zinc-400"
            style={{ fontSize: 12, flexShrink: 0, fontFamily: "ui-monospace, monospace" }}
          >
            {row.meter.serialNumber ?? "—"}
          </span>
        </div>

        <div style={{ marginTop: 2 }}>
          <span className="text-zinc-500 dark:text-zinc-400" style={{ fontSize: 12 }}>
            {serviceLabel} · {t("zones.count", { count: row.meter.zoneCount })}
          </span>
        </div>

        <div style={{ marginTop: 2 }}>
          <span className="text-zinc-400 dark:text-zinc-600" style={{ fontSize: 12 }}>
            {t("lastReading.none")}
          </span>
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger
          style={{
            width: 28,
            height: 28,
            borderRadius: 5,
            border: "1px solid transparent",
            background: "transparent",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
          className="data-[state=open]:border-zinc-200 data-[state=open]:bg-zinc-100 dark:data-[state=open]:border-zinc-700 dark:data-[state=open]:bg-zinc-800"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreHorizontal
            size={15}
            strokeWidth={1.75}
            className="text-zinc-950 dark:text-zinc-50"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem onClick={() => router.push(detailHref)}>
            {t("actions.viewDetails")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export { MeterCard };

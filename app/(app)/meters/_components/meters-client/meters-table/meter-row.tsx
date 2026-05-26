import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconBadge } from "@/components/icon-badge";
import { getServiceTypeDisplay } from "@/lib/constants/service-types";
import type { TMeterGlobalRow } from "@/lib/db/access/meters";
import { formatInstalled } from "../utils";

type TProps = {
  row: TMeterGlobalRow;
  showHistoricalBadge: boolean;
  isLast: boolean;
};

const MeterRow = ({ row, showHistoricalBadge, isLast }: TProps) => {
  const router = useRouter();
  const t = useTranslations("meters.list");

  const { color, Icon } = getServiceTypeDisplay(row.serviceType.code);
  const isHistorical = row.meter.validTo !== null;
  const detailHref = `/properties/${row.property.id}/meters/${row.meter.id}`;

  const serviceLabel = row.serviceType.code
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const tdBorderClass = isLast ? "" : "border-b border-zinc-200 dark:border-zinc-800";
  const tdBaseClass = `${tdBorderClass} text-zinc-950 dark:text-zinc-50`;
  const tdStyle: React.CSSProperties = { padding: "13px 16px", fontSize: 13.5 };

  return (
    <tr
      className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
      style={{ cursor: "pointer" }}
      onClick={() => router.push(detailHref)}
    >
      <td className={tdBaseClass} style={tdStyle}>
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {row.property.name}
          {showHistoricalBadge && isHistorical && (
            <span
              className="bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
              style={{ fontSize: 11, fontWeight: 500, padding: "2px 6px", borderRadius: 4 }}
            >
              {t("badge.historical")}
            </span>
          )}
        </span>
      </td>

      <td className={tdBaseClass} style={tdStyle}>
        <span className="inline-flex items-center gap-1.5">
          <IconBadge icon={Icon} color={color} size="xs" />
          <span style={{ fontSize: 13.5 }}>{serviceLabel}</span>
        </span>
      </td>

      <td
        className={`${tdBorderClass} text-zinc-700 dark:text-zinc-300`}
        style={{ ...tdStyle, fontFamily: "ui-monospace, monospace", fontSize: 13 }}
      >
        {row.meter.serialNumber ?? "—"}
      </td>

      <td
        className={`${tdBorderClass} text-zinc-500 dark:text-zinc-400`}
        style={{ ...tdStyle, fontSize: 13 }}
      >
        {t("zones.count", { count: row.meter.zoneCount })}
      </td>

      <td
        className={`${tdBorderClass} text-zinc-500 dark:text-zinc-400`}
        style={{ ...tdStyle, fontSize: 13 }}
      >
        {formatInstalled(row.meter.installedAt)}
      </td>

      <td
        className={`${tdBorderClass} text-zinc-400 dark:text-zinc-600`}
        style={{ ...tdStyle, fontSize: 13 }}
      >
        —
      </td>

      <td
        className={tdBorderClass}
        style={{ ...tdStyle, width: 48, textAlign: "right" }}
        onClick={(e) => e.stopPropagation()}
      >
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
            }}
            className="data-[state=open]:border-zinc-200 data-[state=open]:bg-zinc-100 dark:data-[state=open]:border-zinc-700 dark:data-[state=open]:bg-zinc-800"
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
      </td>
    </tr>
  );
};

export { MeterRow };

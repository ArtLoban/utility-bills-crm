import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SERVICE_COLORS, SERVICE_LABELS } from "@/lib/constants/service-colors";
import { SERVICE_ICONS } from "@/lib/constants/service-icons";
import type { TGlobalMeter } from "../../../_data/mock";

type TProps = {
  meter: TGlobalMeter;
  showHistoricalBadge: boolean;
  onSubmitReading: (meter: TGlobalMeter) => void;
  isLast: boolean;
};

const formatLastReading = (meter: TGlobalMeter): { text: string; muted: boolean } => {
  if (!meter.lastReading) return { text: "—", muted: true };

  const { date, values } = meter.lastReading;

  if (values.length === 1) {
    const unit = meter.unit ? ` ${meter.unit}` : "";
    return { text: `${date} · ${(values[0] ?? 0).toLocaleString("en-US")}${unit}`, muted: false };
  }

  const zoneParts = values.map((v, i) => `T${i + 1}: ${v.toLocaleString("en-US")}`).join(" / ");
  return { text: `${date} · ${zoneParts}`, muted: false };
};

const MeterRow = ({ meter, showHistoricalBadge, onSubmitReading, isLast }: TProps) => {
  const router = useRouter();
  const t = useTranslations("meters.list");

  const color = SERVICE_COLORS[meter.serviceKey];
  const Icon = SERVICE_ICONS[meter.serviceKey];
  const lastReading = formatLastReading(meter);
  const detailHref = `/properties/${meter.property.id}/meters/${meter.id}`;
  const isActive = meter.removedAt === null;
  const canSubmit = isActive && meter.propertyRole !== "viewer";

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
          {meter.property.name}
          {showHistoricalBadge && meter.removedAt && (
            <span
              className="bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
              style={{
                fontSize: 11,
                fontWeight: 500,
                padding: "2px 6px",
                borderRadius: 4,
              }}
            >
              {t("badge.historical")}
            </span>
          )}
        </span>
      </td>

      <td className={tdBaseClass} style={tdStyle}>
        <span className="inline-flex items-center gap-1.5">
          <span
            style={{
              width: 20,
              height: 20,
              borderRadius: 4,
              background: `${color}1A`,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Icon size={12} style={{ color }} strokeWidth={1.75} />
          </span>
          <span style={{ fontSize: 13.5 }}>{SERVICE_LABELS[meter.serviceKey]}</span>
        </span>
      </td>

      <td
        className={`${tdBorderClass} text-zinc-700 dark:text-zinc-300`}
        style={{ ...tdStyle, fontFamily: "ui-monospace, monospace", fontSize: 13 }}
      >
        {meter.serial}
      </td>

      <td
        className={`${tdBorderClass} text-zinc-500 dark:text-zinc-400`}
        style={{ ...tdStyle, fontSize: 13 }}
      >
        {t("zones.count", { count: meter.zones })}
      </td>

      <td
        className={`${tdBorderClass} text-zinc-500 dark:text-zinc-400`}
        style={{ ...tdStyle, fontSize: 13 }}
      >
        {meter.installedAt}
      </td>

      <td
        className={
          lastReading.muted
            ? `${tdBorderClass} text-zinc-400 dark:text-zinc-600`
            : `${tdBorderClass} text-zinc-950 dark:text-zinc-50`
        }
        style={{ ...tdStyle, fontSize: 13 }}
      >
        {lastReading.text}
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
            className="data-popup-open:border-zinc-200 data-popup-open:bg-zinc-100 dark:data-popup-open:border-zinc-700 dark:data-popup-open:bg-zinc-800"
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
            {canSubmit && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onSubmitReading(meter)}>
                  {t("actions.submitReading")}
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
};

export { MeterRow };

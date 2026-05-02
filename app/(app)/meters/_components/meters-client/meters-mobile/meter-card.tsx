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
};

const MeterCard = ({ meter, showHistoricalBadge, onSubmitReading }: TProps) => {
  const router = useRouter();
  const t = useTranslations("meters.list");

  const color = SERVICE_COLORS[meter.serviceKey];
  const Icon = SERVICE_ICONS[meter.serviceKey];
  const detailHref = `/properties/${meter.property.id}/meters/${meter.id}`;
  const isActive = meter.removedAt === null;
  const canSubmit = isActive && meter.propertyRole !== "viewer";

  const lastReadingText = (() => {
    if (!meter.lastReading) return t("lastReading.none");
    const { date, values } = meter.lastReading;
    if (values.length === 1) {
      const unit = meter.unit ? ` ${meter.unit}` : "";
      return `${date} · ${(values[0] ?? 0).toLocaleString("en-US")}${unit}`;
    }
    const zoneParts = values.map((v, i) => `T${i + 1}: ${v.toLocaleString("en-US")}`).join(" / ");
    return `${date} · ${zoneParts}`;
  })();

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
            {meter.property.name}
            {showHistoricalBadge && meter.removedAt && (
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
            {meter.serial}
          </span>
        </div>

        <div
          style={{
            marginTop: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span className="text-zinc-500 dark:text-zinc-400" style={{ fontSize: 12 }}>
            {SERVICE_LABELS[meter.serviceKey]} · {t("zones.count", { count: meter.zones })}
          </span>
        </div>

        <div style={{ marginTop: 2 }}>
          <span
            className={
              meter.lastReading
                ? "text-zinc-700 dark:text-zinc-300"
                : "text-zinc-400 dark:text-zinc-600"
            }
            style={{ fontSize: 12 }}
          >
            {lastReadingText}
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
          className="data-popup-open:border-zinc-200 data-popup-open:bg-zinc-100 dark:data-popup-open:border-zinc-700 dark:data-popup-open:bg-zinc-800"
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
          {canSubmit && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onSubmitReading(meter);
                }}
              >
                {t("actions.submitReading")}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export { MeterCard };

import { MoreHorizontal } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SERVICE_COLORS } from "@/lib/constants/service-colors";
import { SERVICE_ICONS } from "@/lib/constants/service-icons";
import { BORDER, DESTRUCTIVE, MUTED_FG } from "@/lib/constants/ui-tokens";
import { TBill } from "@/app/(app)/bills/_data/mock";

type TProps = { row: TBill };

const BillCard = ({ row }: TProps) => {
  const color = SERVICE_COLORS[row.service.id];
  const Icon = SERVICE_ICONS[row.service.id];
  const shortDate = row.date.split(" ").slice(0, 2).join(" ");
  const amountStr = `−${row.amount.toLocaleString()}`;

  return (
    <div
      style={{
        background: "#fff",
        border: `1px solid ${BORDER}`,
        borderRadius: 8,
        boxShadow: "0 1px 2px rgba(24,24,27,0.04)",
        padding: 14,
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}
    >
      {/* Service icon */}
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

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Top row */}
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
            {shortDate} · {row.service.name}
          </span>
          <span
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: DESTRUCTIVE,
              fontFeatureSettings: '"tnum" 1',
              flexShrink: 0,
            }}
          >
            {amountStr}
          </span>
        </div>

        {/* Bottom row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 2,
          }}
        >
          <span
            style={{
              fontSize: 12,
              color: MUTED_FG,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              flex: 1,
            }}
          >
            {row.property.name} · {row.period}
          </span>
          <span style={{ fontSize: 11.5, color: MUTED_FG, marginLeft: 4, flexShrink: 0 }}>UAH</span>
        </div>
      </div>

      {/* Kebab */}
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
          className="data-popup-open:border-zinc-200 data-popup-open:bg-zinc-100"
        >
          <MoreHorizontal size={15} strokeWidth={1.75} color="#09090b" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          {/* devnote: wire Edit action when API routes exist */}
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuSeparator />
          {/* devnote: wire Delete action when API routes exist */}
          <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export { BillCard };

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
import { DESTRUCTIVE } from "@/lib/constants/ui-tokens";
import { TBill } from "@/app/(app)/bills/_data/mock";

type TProps = { row: TBill };

const BillCard = ({ row }: TProps) => {
  const color = SERVICE_COLORS[row.service.id];
  const Icon = SERVICE_ICONS[row.service.id];
  const shortDate = row.date.split(" ").slice(0, 2).join(" ");
  const amountStr = `−${row.amount.toLocaleString()}`;

  return (
    <div
      className="border border-zinc-200 bg-white shadow-[0_1px_2px_rgba(24,24,27,0.04)] dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none"
      style={{
        borderRadius: 8,
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
            className="text-zinc-500 dark:text-zinc-400"
            style={{
              fontSize: 12,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              flex: 1,
            }}
          >
            {row.property.name} · {row.period}
          </span>
          <span
            className="text-zinc-500 dark:text-zinc-400"
            style={{ fontSize: 11.5, marginLeft: 4, flexShrink: 0 }}
          >
            UAH
          </span>
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
          className="data-popup-open:border-zinc-200 data-popup-open:bg-zinc-100 dark:data-popup-open:border-zinc-700 dark:data-popup-open:bg-zinc-800"
        >
          <MoreHorizontal
            size={15}
            strokeWidth={1.75}
            className="text-zinc-950 dark:text-zinc-50"
          />
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

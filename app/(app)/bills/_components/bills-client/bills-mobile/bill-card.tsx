"use client";

import { useRouter } from "next/navigation";
import { MoreHorizontal } from "lucide-react";
import { useFormatter } from "next-intl";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DESTRUCTIVE } from "@/lib/constants/ui-tokens";
import { getServiceLabel } from "@/lib/constants/service-colors";
import { getServiceTypeVisuals } from "@/features/services/service-type";
import type { TBillGlobalRow } from "@/lib/db/access/bills";
import { useBillsTable } from "../context";

type TProps = { row: TBillGlobalRow };

const BillCard = ({ row }: TProps) => {
  const router = useRouter();
  const { requestDelete } = useBillsTable();
  const formatter = useFormatter();
  const { color, Icon } = getServiceTypeVisuals(row.serviceTypeCode);

  const shortDate = formatter.dateTime(new Date(row.bill.createdAt), {
    month: "short",
    day: "numeric",
  });
  const periodLabel = formatter.dateTime(new Date(row.bill.periodMonth), {
    year: "numeric",
    month: "long",
  });
  const serviceName = getServiceLabel(row.serviceTypeCode);
  const amount = parseFloat(row.bill.amount);
  const amountStr = `−${amount.toLocaleString()}`;

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
            {shortDate} · {serviceName}
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
            {row.property.name} · {periodLabel}
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
          className="data-[state=open]:border-zinc-200 data-[state=open]:bg-zinc-100 dark:data-[state=open]:border-zinc-700 dark:data-[state=open]:bg-zinc-800"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreHorizontal
            size={15}
            strokeWidth={1.75}
            className="text-zinc-950 dark:text-zinc-50"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem onClick={() => router.push(`/bills/${row.bill.id}/edit`)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={() => requestDelete(row)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export { BillCard };

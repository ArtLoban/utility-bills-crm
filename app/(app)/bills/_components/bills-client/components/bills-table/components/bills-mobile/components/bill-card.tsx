"use client";

import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react";
import { useFormatter } from "next-intl";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getServiceLabel } from "@/lib/constants/service-colors";
import { getServiceTypeVisuals } from "@/features/services/service-type";
import type { TBillGlobalRow } from "@/lib/db/access/bills";
import { useBillsTable } from "@/app/(app)/bills/_components/bills-client/context";

type TProps = { row: TBillGlobalRow };

const BillCard = ({ row }: TProps) => {
  const router = useRouter();
  const { requestDelete } = useBillsTable();
  const formatter = useFormatter();
  const { color, Icon } = getServiceTypeVisuals(row.serviceTypeCode);

  const dateStr = format(new Date(row.bill.createdAt), "dd/MM/yyyy");
  const periodLabel = formatter.dateTime(new Date(row.bill.periodMonth), {
    year: "numeric",
    month: "long",
  });
  const serviceName = getServiceLabel(row.serviceTypeCode);
  const amount = parseFloat(row.bill.amount);
  const amountStr = `−${amount.toLocaleString()}`;

  return (
    <div className="flex items-stretch gap-2 rounded-lg border border-zinc-200 bg-white py-3 pr-2.5 pl-3.5 shadow-[0_1px_2px_rgba(24,24,27,0.04)] dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none">
      {/* Content */}
      <div className="min-w-0 flex-1">
        {/* Row 1: icon + service name + amount */}
        <div className="flex items-center gap-2">
          <div
            className="flex h-3 w-3 shrink-0 items-center justify-center rounded-sm"
            style={{ background: color + "28" }}
          >
            <Icon size={7} style={{ color }} strokeWidth={2.5} />
          </div>
          <span className="min-w-0 flex-1 truncate text-sm font-semibold tracking-tight">
            {serviceName}
          </span>
          <span className="text-destructive shrink-0 text-sm font-bold whitespace-nowrap tabular-nums">
            {amountStr}
          </span>
          <span className="text-muted-foreground ml-0.5 shrink-0 text-xs">UAH</span>
        </div>

        {/* Row 2: property */}
        <div className="mt-1.5 pl-5">
          <span className="text-muted-foreground block truncate text-xs">{row.property.name}</span>
        </div>

        {/* Row 3: date + period */}
        <div className="mt-1 flex items-center justify-between pl-5">
          <span className="text-muted-foreground text-xs">{dateStr}</span>
          <span className="text-xs font-medium whitespace-nowrap text-zinc-700 dark:text-zinc-400">
            {periodLabel}
          </span>
        </div>
      </div>

      {/* Kebab */}
      <DropdownMenu>
        <DropdownMenuTrigger
          className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center self-center rounded border border-transparent bg-transparent data-[state=open]:border-zinc-200 data-[state=open]:bg-zinc-100 dark:data-[state=open]:border-zinc-700 dark:data-[state=open]:bg-zinc-800"
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

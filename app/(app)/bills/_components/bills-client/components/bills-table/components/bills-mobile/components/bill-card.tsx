"use client";

import { format } from "date-fns";
import { useFormatter } from "next-intl";
import { DISPLAY_DATE_FORMAT } from "@/lib/format/date";
import { useFormatMoney } from "@/lib/format/use-format-money";
import type { TBillGlobalRow } from "@/lib/db/access/bills";
import { IconBadge } from "@/components/icon-badge";
import { BillRowActions } from "../../components/bill-row-actions";
import { useServiceTypeMeta } from "@/features/services/hooks/use-service-type";

type TProps = {
  row: TBillGlobalRow;
};

export const BillCard = ({ row }: TProps) => {
  const { serviceTypeCode, bill, property } = row;
  const formatter = useFormatter();
  const formatMoney = useFormatMoney();
  const { color, Icon, label: serviceName } = useServiceTypeMeta(serviceTypeCode);

  const dateStr = format(new Date(bill.createdAt), DISPLAY_DATE_FORMAT);
  const periodLabel = formatter.dateTime(new Date(bill.periodMonth), {
    year: "numeric",
    month: "long",
  });
  const amountStr = `−${formatMoney(bill.amount)}`;

  return (
    <div className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white py-3 pr-2.5 pl-3.5 shadow-[0_1px_2px_rgba(24,24,27,0.04)] dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none">
      <div className="min-w-0 flex-1 text-sm">
        <div className="flex items-center gap-2">
          <IconBadge icon={Icon} color={color} size="sm" />
          <span className="min-w-0 flex-1 truncate font-semibold tracking-tight">
            {serviceName}
          </span>
          <span className="text-destructive shrink-0 font-bold whitespace-nowrap tabular-nums">
            {amountStr}
          </span>
        </div>

        <div className="mt-1.5">
          <span className="text-muted-foreground block truncate">{property.name} </span>
        </div>

        <div className="mt-1 flex items-center justify-between">
          <span className="text-muted-foreground">{dateStr}</span>
          <span className="font-medium whitespace-nowrap text-zinc-700 dark:text-zinc-400">
            {periodLabel}
          </span>
        </div>
      </div>

      <BillRowActions bill={row} />
    </div>
  );
};

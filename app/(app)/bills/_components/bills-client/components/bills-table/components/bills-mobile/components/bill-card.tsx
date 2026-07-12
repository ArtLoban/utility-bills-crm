"use client";

import { format } from "date-fns";
import { useFormatter } from "next-intl";
import { DISPLAY_DATE_FORMAT } from "@/lib/format/date";
import { useFormatMoney } from "@/lib/format/use-format-money";
import type { TBillGlobalRow } from "@/lib/db/access/bills";
import { IconBadge } from "@/components/icon-badge";
import { Surface } from "@/components/surface";
import { BillRowActions } from "../../bill-row-actions";
import { useServiceTypeMeta } from "@/features/services/hooks/use-service-type";

type TProps = {
  row: TBillGlobalRow;
};

export const BillCard = ({ row }: TProps) => {
  const { serviceTypeCode, serviceName, bill, property } = row;
  const formatter = useFormatter();
  const formatMoney = useFormatMoney();
  const { color, Icon, label: typeLabel } = useServiceTypeMeta(serviceTypeCode);
  const serviceLabel = serviceName ?? typeLabel;

  const dateStr = format(new Date(bill.createdAt), DISPLAY_DATE_FORMAT);
  const periodLabel = formatter.dateTime(new Date(bill.periodMonth), {
    year: "numeric",
    month: "long",
  });
  const amountStr = `−${formatMoney(bill.amount)}`;

  return (
    <Surface elevation="sm" className="flex items-center gap-2 py-3 pr-2.5 pl-3.5">
      <div className="min-w-0 flex-1 text-sm">
        <div className="flex items-center gap-2">
          <IconBadge icon={Icon} color={color} size="sm" />
          <span className="min-w-0 flex-1 truncate font-semibold tracking-tight">
            {serviceLabel}
          </span>
          <span className="text-destructive shrink-0 font-bold whitespace-nowrap tabular-nums">
            {amountStr}
          </span>
        </div>

        <div className="mt-1.5">
          <span className="block truncate">{property.name}</span>
        </div>

        <div className="mt-1 flex items-center justify-between">
          <span className="text-muted-foreground">{dateStr}</span>
          <span className="text-muted-foreground font-medium whitespace-nowrap">{periodLabel}</span>
        </div>
      </div>

      <BillRowActions bill={row} />
    </Surface>
  );
};

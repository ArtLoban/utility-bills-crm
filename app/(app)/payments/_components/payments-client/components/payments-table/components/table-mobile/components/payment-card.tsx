"use client";

import { format } from "date-fns";
import { DISPLAY_DATE_FORMAT } from "@/lib/format/date";
import type { TPaymentGlobalRow } from "@/features/payments/types";
import { IconBadge } from "@/components/icon-badge";
import { useServiceTypeMeta } from "@/features/services/hooks/use-service-type";
import { PaymentRowActions } from "../../table-desktop/components/payment-row-actions";

type TProps = {
  payment: TPaymentGlobalRow;
};

export const PaymentCard = ({ payment }: TProps) => {
  const { serviceTypeCode, payment: row, property } = payment;
  const { color, Icon, label: serviceName } = useServiceTypeMeta(serviceTypeCode);

  const dateStr = format(new Date(`${row.paidAt}T00:00:00`), DISPLAY_DATE_FORMAT);
  const amountStr = parseFloat(row.amount).toLocaleString();

  return (
    <div className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white py-3 pr-2.5 pl-3.5 shadow-[0_1px_2px_rgba(24,24,27,0.04)] dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none">
      <div className="min-w-0 flex-1 text-sm">
        <div className="flex items-center gap-2">
          <IconBadge icon={Icon} color={color} size="sm" />
          <span className="min-w-0 flex-1 truncate font-semibold tracking-tight">
            {serviceName}
          </span>
          <span className="shrink-0 font-bold whitespace-nowrap text-green-600 tabular-nums dark:text-green-500">
            {amountStr}
          </span>
          <span className="text-muted-foreground ml-0.5 shrink-0 text-xs">UAH</span>
        </div>

        <div className="mt-1.5">
          <span className="text-muted-foreground block truncate">{property.name}</span>
        </div>

        <div className="mt-1">
          <span className="text-muted-foreground">{dateStr}</span>
        </div>
      </div>

      <PaymentRowActions payment={payment} />
    </div>
  );
};

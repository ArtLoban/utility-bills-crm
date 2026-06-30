"use client";

import { format } from "date-fns";
import { DISPLAY_DATE_FORMAT } from "@/lib/format/date";
import { useFormatMoney } from "@/lib/format/use-format-money";
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
  const formatMoney = useFormatMoney();

  const dateStr = format(new Date(`${row.paidAt}T00:00:00`), DISPLAY_DATE_FORMAT);
  const amountStr = formatMoney(row.amount);

  return (
    <div className="border-border bg-card flex items-center gap-2 rounded-lg border py-3 pr-2.5 pl-3.5 shadow-sm dark:shadow-none">
      <div className="min-w-0 flex-1 text-sm">
        <div className="flex items-center gap-2">
          <IconBadge icon={Icon} color={color} size="sm" />
          <span className="min-w-0 flex-1 truncate font-semibold tracking-tight">
            {serviceName}
          </span>
          <span className="text-success shrink-0 font-bold whitespace-nowrap tabular-nums">
            {amountStr}
          </span>
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

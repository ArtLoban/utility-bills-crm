"use client";

import Link from "next/link";
import { ChevronRight, Receipt, Wallet } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import { useFormatMoney } from "@/lib/format/use-format-money";
import {
  formatDisplayDate,
  formatMonthYearLong,
  isoToYearMonth,
  toIsoDate,
} from "@/lib/format/date";
import { billPath, paymentPath } from "@/lib/routes";
import type { BillId } from "@/lib/db/schema/bills";
import type { PaymentId } from "@/lib/db/schema/payments";
import type { TServiceActivityItem } from "../../../_data/queries";

type TProps = {
  item: TServiceActivityItem;
  isLast: boolean;
};

export const ActivityRow = ({ item, isLast }: TProps) => {
  const formatMoney = useFormatMoney();
  const locale = useLocale();
  const t = useTranslations("services.detail.activity");

  const isBill = item.type === "bill";
  const Icon = isBill ? Receipt : Wallet;
  const monthYear = formatMonthYearLong(isoToYearMonth(toIsoDate(item.date)), locale);

  const href = isBill ? billPath(item.id as BillId) : paymentPath(item.id as PaymentId);

  return (
    <Link
      href={href}
      className={cn(
        "group hover:bg-muted/50 flex items-center gap-3.5 px-4 py-3 transition-colors sm:px-5",
        !isLast && "border-border border-b",
      )}
    >
      <div
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-lg",
          isBill ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success",
        )}
      >
        <Icon className="size-3.5" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="text-foreground text-sm font-medium">
          {isBill ? t("bill", { period: monthYear }) : t("payment", { period: monthYear })}
        </div>
        <div className="text-muted-foreground text-xs">{formatDisplayDate(item.date)}</div>
      </div>

      <div
        className={cn(
          "text-sm font-semibold tabular-nums",
          isBill ? "text-destructive" : "text-success",
        )}
      >
        {isBill ? "−" : "+"}
        {formatMoney(item.amount)}
      </div>

      <ChevronRight className="text-muted-foreground/40 group-hover:text-primary size-3.5 shrink-0 transition-colors" />
    </Link>
  );
};

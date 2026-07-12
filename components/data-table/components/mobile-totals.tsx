"use client";

import { useFormatMoney } from "@/lib/format/use-format-money";

export const MOBILE_TOTALS_TONE = {
  NEGATIVE: "negative",
  POSITIVE: "positive",
} as const;

export type TMobileTotalsTone = (typeof MOBILE_TOTALS_TONE)[keyof typeof MOBILE_TOTALS_TONE];

type TProps = {
  amount: string;
  label: string;
  tone?: TMobileTotalsTone;
};

export const MobileTotals = ({ amount, label, tone = MOBILE_TOTALS_TONE.NEGATIVE }: TProps) => {
  const formatMoney = useFormatMoney();

  const isNegative = tone === MOBILE_TOTALS_TONE.NEGATIVE;
  const value = formatMoney(amount);
  const amountStr = isNegative ? `−${value}` : value;

  return (
    <div className="border-border mt-4 flex items-center justify-between border-t pt-3.5">
      <span className="text-muted-foreground text-sm">{label}</span>
      <div className="text-sm whitespace-nowrap tabular-nums">
        <span className={isNegative ? "text-destructive font-bold" : "text-success font-bold"}>
          {amountStr}
        </span>
      </div>
    </div>
  );
};

import { NUMBER_FORMATTER } from "@/lib/format/currency";

export const MOBILE_TOTALS_TONE = {
  NEGATIVE: "negative",
  POSITIVE: "positive",
} as const;

export type TMobileTotalsTone = (typeof MOBILE_TOTALS_TONE)[keyof typeof MOBILE_TOTALS_TONE];

type TProps = {
  amount: string;
  tone?: TMobileTotalsTone;
};

export const MobileTotals = ({ amount, tone = MOBILE_TOTALS_TONE.NEGATIVE }: TProps) => {
  const value = NUMBER_FORMATTER.format(Number(amount));
  const isNegative = tone === MOBILE_TOTALS_TONE.NEGATIVE;
  const amountStr = isNegative ? `−${value}` : value;

  return (
    <div className="border-border mt-4 flex items-center justify-between border-t pt-3.5">
      <span className="text-muted-foreground text-sm">Total</span>
      <div className="text-sm whitespace-nowrap tabular-nums">
        <span className={isNegative ? "text-destructive font-bold" : "text-success font-bold"}>
          {amountStr}
        </span>
        <span className="text-muted-foreground ml-0.5 shrink-0">UAH</span>
      </div>
    </div>
  );
};

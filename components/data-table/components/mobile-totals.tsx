import { NUMBER_FORMATTER } from "@/lib/format/currency";

type TProps = {
  amount: string;
};

// TODO: green/red/gray
export const MobileTotals = ({ amount }: TProps) => {
  const value = NUMBER_FORMATTER.format(Number(amount));
  const amountStr = `−${value}`;

  return (
    <div className="border-border mt-4 flex items-center justify-between border-t pt-3.5">
      <span className="text-muted-foreground text-sm">Total</span>
      <div className="text-sm whitespace-nowrap tabular-nums">
        <span className="text-destructive font-bold">{amountStr}</span>
        <span className="text-muted-foreground ml-0.5 shrink-0">UAH</span>
      </div>
    </div>
  );
};

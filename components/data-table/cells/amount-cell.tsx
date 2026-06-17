import { cn } from "@/lib/utils";
import { useFormatMoney } from "@/lib/format/use-format-money";

type TProps = {
  value: number;
  kind?: "expense" | "payment" | "neutral";
  className?: string;
};

export const AmountCell = ({ value, kind = "neutral", className }: TProps) => {
  const formatMoney = useFormatMoney();

  const formatted = formatMoney(value, { symbol: false });

  return (
    <span
      className={cn(
        "tabular-nums",
        kind === "expense" && "text-destructive",
        kind === "payment" && "text-success",
        className,
      )}
    >
      {formatted}
    </span>
  );
};

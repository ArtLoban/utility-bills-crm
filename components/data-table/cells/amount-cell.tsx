import { useFormatter } from "next-intl";

import { cn } from "@/lib/utils";

type TAmountKind = "expense" | "payment" | "neutral";

type TProps = {
  value: number;
  kind?: TAmountKind;
  currency?: string;
  className?: string;
};

export const AmountCell = ({ value, kind = "neutral", currency = "UAH", className }: TProps) => {
  const format = useFormatter();

  const formatted = format.number(value, {
    currency,
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });

  return (
    <span
      className={cn(
        "tabular-nums",
        kind === "expense" && "text-destructive",
        kind === "payment" && "text-green-600 dark:text-green-500",
        className,
      )}
    >
      {formatted}
    </span>
  );
};

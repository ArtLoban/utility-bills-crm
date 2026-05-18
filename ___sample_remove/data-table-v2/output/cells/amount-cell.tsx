import { useFormatter } from "next-intl";

import { cn } from "@/lib/utils";

type TAmountKind = "expense" | "payment" | "neutral";

type TProps = {
  /** Numeric value in the base currency unit (UAH). Stored as `numeric(12,2)` in DB,
   *  but for display we accept number for simplicity. Convert from string at the boundary. */
  value: number;

  /** Visual semantic. `expense` = red, `payment` = green, `neutral` = no color. */
  kind?: TAmountKind;

  /** Currency code (ISO 4217). MVP locks to UAH; prop exists so we don't refactor the call sites in v3 multi-currency. */
  currency?: string;

  className?: string;
};

export const AmountCell = ({ value, kind = "neutral", currency = "UAH", className }: TProps) => {
  const format = useFormatter();

  const formatted = format.number(value, {
    style: "currency",
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

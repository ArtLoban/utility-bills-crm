import { useFormatter } from "next-intl";

import { cn } from "@/lib/utils";

type TDateFormat = "short" | "full" | "month";

type TProps = {
  /** Stored as UTC timestamptz in the DB. Accepts Date or ISO string. */
  value?: Date | string;

  /**
   * - `short` (default): "Oct 15, 2024" — for lists, tables, headers.
   * - `full`: "October 15, 2024" — for legally/contextually important contexts.
   * - `month`: "October 2024" — for bill periods.
   */
  format?: TDateFormat;

  className?: string;
};

// devnote. сделать проверку на несуществующее значение
export const DateCell = ({ value, format: fmt = "short", className }: TProps) => {
  const formatter = useFormatter();
  const date = typeof value === "string" ? new Date(value) : value;

  const formatted =
    fmt === "full"
      ? formatter.dateTime(date, {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : fmt === "month"
        ? formatter.dateTime(date, { year: "numeric", month: "long" })
        : formatter.dateTime(date, {
            year: "numeric",
            month: "short",
            day: "numeric",
          });

  return (
    <span className={cn("tabular-nums", className)}>
      <time dateTime={date.toISOString()}>{formatted}</time>
    </span>
  );
};

import { useFormatter } from "next-intl";

import { cn } from "@/lib/utils";
import { DISPLAY_DATE_FORMAT } from "@/lib/format/date";
import { format } from "date-fns";

type TProps = {
  value?: Date | string;
  format?: "default" | "month";
  className?: string;
};

export const DateCell = ({ value, format: fmt = "default", className }: TProps) => {
  const formatter = useFormatter();

  if (!value) return null;

  const date = typeof value === "string" ? new Date(value) : value;

  const formatted =
    fmt === "month"
      ? formatter.dateTime(date, { year: "numeric", month: "long" })
      : format(date, DISPLAY_DATE_FORMAT);

  return (
    <span className={cn("tabular-nums", className)}>
      <time dateTime={date.toISOString()}>{formatted}</time>
    </span>
  );
};

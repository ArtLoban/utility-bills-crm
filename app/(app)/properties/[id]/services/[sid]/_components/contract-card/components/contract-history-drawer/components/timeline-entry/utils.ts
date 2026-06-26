import { formatDisplayDate } from "@/lib/format/date";

export const formatPeriod = (validFrom: Date, validTo: Date | null, presentLabel: string): string =>
  `${formatDisplayDate(validFrom)} — ${validTo ? formatDisplayDate(validTo) : presentLabel}`;

import { formatReadingValue } from "@/features/readings/format";

type TProps = {
  value: string | null;
};

export const ReadingValueCell = ({ value }: TProps) => (
  <span className="text-foreground tabular-nums">{formatReadingValue(value)}</span>
);

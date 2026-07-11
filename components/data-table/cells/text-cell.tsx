import { cn } from "@/lib/utils";

type TProps = {
  value: string | null | undefined;
  className?: string;
};

export const TextCell = ({ value, className }: TProps) => {
  if (!value) return null;

  return (
    <span className={cn("block truncate", className)} title={value}>
      {value}
    </span>
  );
};

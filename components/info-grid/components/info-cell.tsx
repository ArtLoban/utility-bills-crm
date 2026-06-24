import { cn } from "@/lib/utils";
import type { TInfoRow } from "../types";

type TProps = TInfoRow & { className?: string };

export const InfoCell = ({ label, value, className }: TProps) => (
  <div className={cn("py-3.5", className)}>
    <p className="text-muted-foreground mb-1 text-xs font-semibold tracking-wider uppercase">
      {label}
    </p>
    <p className="text-foreground text-sm">{value}</p>
  </div>
);

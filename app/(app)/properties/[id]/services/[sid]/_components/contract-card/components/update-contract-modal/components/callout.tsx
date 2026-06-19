import type { ReactNode } from "react";
import { Info } from "lucide-react";

type TProps = { children: ReactNode };

export const Callout = ({ children }: TProps) => (
  <div className="bg-muted border-border flex items-start gap-2.5 rounded-lg border px-3.5 py-3">
    <Info className="text-muted-foreground mt-px size-3.5 shrink-0" />
    <p className="text-muted-foreground text-xs leading-relaxed">{children}</p>
  </div>
);

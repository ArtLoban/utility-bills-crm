import { AlertTriangle } from "lucide-react";
import type { ReactNode } from "react";

type TProps = {
  title: string;
  children: ReactNode;
};

export const FormErrorBanner = ({ title, children }: TProps) => (
  <div className="border-destructive/35 bg-destructive/10 flex items-start gap-3 rounded-lg border px-4 py-3.5">
    <AlertTriangle size={18} className="text-destructive mt-px shrink-0" />
    <div className="min-w-0 flex-1">
      <div className="text-destructive text-sm font-semibold">{title}</div>
      <div className="text-destructive/80 mt-0.5 text-sm">{children}</div>
    </div>
  </div>
);

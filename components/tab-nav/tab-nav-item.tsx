import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type TProps = {
  icon: LucideIcon;
  label: ReactNode;
  isActive: boolean;
  children?: ReactNode;
};

export const TabNavItem = ({ icon: Icon, label, isActive, children }: TProps) => (
  <>
    <Icon className={cn("size-4", isActive && "text-primary")} />
    {label}
    {children}
    {isActive && <span className="bg-primary absolute inset-x-0 -bottom-px h-0.5 rounded-full" />}
  </>
);

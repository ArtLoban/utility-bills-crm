import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type TProps = {
  children: ReactNode;
  className?: string;
};

export const TabNav = ({ children, className }: TProps) => (
  <nav className={cn("border-border flex items-center border-b", className)}>{children}</nav>
);

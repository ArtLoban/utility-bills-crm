import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type TProps = {
  children: ReactNode;
  className?: string;
};

export const TabNav = ({ children, className }: TProps) => (
  <nav
    className={cn(
      "border-border flex items-center overflow-x-auto border-b [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
      className,
    )}
  >
    {children}
  </nav>
);

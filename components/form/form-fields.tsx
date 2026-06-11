import { type ReactNode } from "react";

import { cn } from "@/lib/utils";

type TProps = {
  children: ReactNode;
  className?: string;
};

export const FormFields = ({ children, className }: TProps) => (
  <div className={cn("flex flex-col gap-4", className)}>{children}</div>
);

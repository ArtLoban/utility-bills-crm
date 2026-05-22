import * as React from "react";

import { cn } from "@/lib/utils";

export const Input = ({ className, type, value, ...props }: React.ComponentProps<"input">) => {
  const filled = value !== undefined && value !== "";
  return (
    <input
      type={type}
      value={value}
      data-slot="input"
      data-filled={filled ? true : undefined}
      className={cn(
        "border-input file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 disabled:bg-input/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 h-8 w-full min-w-0 rounded-sm border bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-3 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-3 data-[filled=true]:border-[var(--field-tint-border)] data-[filled=true]:bg-[var(--field-tint-bg)] md:text-sm",
        className,
      )}
      {...props}
    />
  );
};

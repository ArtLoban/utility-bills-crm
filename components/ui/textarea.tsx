import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = ({ className, value, ...props }: React.ComponentProps<"textarea">) => {
  const filled = value !== undefined && value !== "";
  return (
    <textarea
      value={value}
      data-slot="textarea"
      data-filled={filled ? true : undefined}
      className={cn(
        "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 disabled:bg-input/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 flex field-sizing-content min-h-16 w-full rounded-sm border bg-transparent px-2.5 py-2 text-sm transition-colors outline-none focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-3 data-[filled=true]:border-[var(--field-tint-border)] data-[filled=true]:bg-[var(--field-tint-bg)]",
        className,
      )}
      {...props}
    />
  );
};

export { Textarea };

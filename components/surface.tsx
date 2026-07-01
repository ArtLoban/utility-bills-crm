import { type ComponentProps } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// Bordered, rounded container surface. `elevation` controls the shadow behavior:
// none — flat (toolbars), sm — resting shadow (static cards),
// hover — resting shadow + lift on hover (clickable cards).
const surfaceVariants = cva("rounded-lg border bg-card", {
  variants: {
    elevation: {
      none: "",
      sm: "shadow-sm dark:shadow-none",
      hover:
        "shadow-sm transition duration-150 hover:-translate-y-px hover:shadow-md dark:shadow-none dark:hover:border-brand-border",
    },
  },
  defaultVariants: { elevation: "none" },
});

type TProps = ComponentProps<"div"> & VariantProps<typeof surfaceVariants> & { asChild?: boolean };

export const Surface = ({ className, elevation, asChild = false, ...props }: TProps) => {
  const Comp = asChild ? Slot : "div";
  return (
    <Comp
      data-slot="surface"
      className={cn(surfaceVariants({ elevation, className }))}
      {...props}
    />
  );
};

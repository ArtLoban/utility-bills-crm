import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";

type TProps = ComponentProps<"section"> & {
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
};

export const SectionCard = ({
  title,
  description,
  actions,
  className,
  children,
  ...props
}: TProps) => (
  <section
    className={cn(
      "border-border bg-card text-card-foreground rounded-md border shadow-[0_1px_2px_rgba(24,24,27,0.05)]",
      className,
    )}
    {...props}
  >
    {(title || actions) && (
      <div className="border-border flex items-center justify-between gap-3 border-b px-5 py-4">
        {title && (
          <div className="flex flex-col gap-0.5">
            <h2 className="text-foreground text-sm font-semibold tracking-[-0.1px]">{title}</h2>
            {description && <p className="text-muted-foreground text-xs">{description}</p>}
          </div>
        )}
        {actions}
      </div>
    )}
    {children}
  </section>
);

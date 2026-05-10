import { type ComponentProps } from "react";

import { cn } from "@/lib/utils";

type TProps = ComponentProps<"div">;

export const DataCard = ({ className, ...props }: TProps) => (
  <div
    className={cn(
      "rounded-lg border bg-white shadow transition-shadow duration-150 hover:shadow-md",
      "dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none dark:hover:shadow-none",
      className,
    )}
    {...props}
  />
);

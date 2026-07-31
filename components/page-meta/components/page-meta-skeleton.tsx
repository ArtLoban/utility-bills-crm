import { Fragment } from "react";

import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const DEFAULT_ITEM_WIDTHS = ["w-20", "w-24"] as const;

type TProps = {
  itemWidths?: readonly string[];
};

export const PageMetaSkeleton = ({ itemWidths = DEFAULT_ITEM_WIDTHS }: TProps) => (
  <div className="mt-1.5 flex items-center gap-2 text-sm">
    {itemWidths.map((width, index) => (
      <Fragment key={index}>
        {index > 0 && <span className="text-zinc-300 dark:text-zinc-700">·</span>}
        <Skeleton className={cn("h-3.5", width)} />
      </Fragment>
    ))}
  </div>
);

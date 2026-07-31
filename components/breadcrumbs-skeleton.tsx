import { Fragment } from "react";
import { ChevronRight } from "lucide-react";

import { SkeletonLine } from "@/components/skeleton-line";

type TProps = {
  itemWidths: readonly string[];
};

export const BreadcrumbsSkeleton = ({ itemWidths }: TProps) => (
  <div className="mb-4 flex flex-wrap items-center gap-1.5">
    {itemWidths.map((width, index) => (
      <Fragment key={index}>
        {index > 0 && (
          <ChevronRight size={14} className="shrink-0 text-zinc-300 dark:text-zinc-700" />
        )}
        <SkeletonLine size="xs" className={width} />
      </Fragment>
    ))}
  </div>
);

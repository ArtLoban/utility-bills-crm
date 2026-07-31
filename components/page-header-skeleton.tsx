import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { PageMetaSkeleton } from "@/components/page-meta/components/page-meta-skeleton";

type TProps = {
  titleWidth: string;
  metaItemWidths?: readonly string[];
  actions?: ReactNode;
  leading?: ReactNode;
};

export const PageHeaderSkeleton = ({ titleWidth, metaItemWidths, actions, leading }: TProps) => {
  const titleBlock = (
    <div className="min-w-0">
      <Skeleton className={cn("h-8 md:h-9", titleWidth)} />
      {metaItemWidths && <PageMetaSkeleton itemWidths={metaItemWidths} />}
    </div>
  );

  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4 md:mb-7">
      {leading ? (
        <div className="flex min-w-0 items-start gap-3 sm:items-center sm:gap-4">
          {leading}
          {titleBlock}
        </div>
      ) : (
        titleBlock
      )}
      {actions && <div className="self-end sm:self-auto">{actions}</div>}
    </div>
  );
};

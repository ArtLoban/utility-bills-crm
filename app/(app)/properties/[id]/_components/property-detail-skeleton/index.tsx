import { ChevronRight } from "lucide-react";

import { PageShell } from "@/components/page-shell";
import { PageMetaSkeleton } from "@/components/page-meta/components/page-meta-skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonLine } from "@/components/skeleton-line";
import { TabsNavSkeleton } from "./components/tabs-nav-skeleton";
import { ServicesCardSkeleton } from "./components/services-card-skeleton";

const META_ITEM_WIDTHS = ["w-40", "w-20", "w-32"] as const;

export const PropertyDetailSkeleton = () => (
  <PageShell>
    <div className="mb-4 flex items-center gap-1.5">
      <SkeletonLine size="xs" className="w-16" />
      <ChevronRight size={14} className="shrink-0 text-zinc-300 dark:text-zinc-700" />
      <SkeletonLine size="xs" className="w-32" />
    </div>

    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4 md:mb-7">
      <div className="min-w-0">
        <Skeleton className="h-8 w-56 md:h-9" />
        <PageMetaSkeleton itemWidths={META_ITEM_WIDTHS} />
      </div>
      <div className="flex shrink-0 items-center gap-2 self-end sm:self-auto">
        <Skeleton className="h-8 w-20 rounded-md" />
        <Skeleton className="size-8 rounded-md" />
      </div>
    </div>

    <TabsNavSkeleton />
    <ServicesCardSkeleton />
  </PageShell>
);

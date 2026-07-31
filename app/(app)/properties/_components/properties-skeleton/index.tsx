import { PageShell } from "@/components/page-shell";
import { PageHeaderSkeleton } from "@/components/page-header-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

import { PropertyCardSkeleton } from "./components/property-card-skeleton";

const SKELETON_CARD_COUNT = 3;
const META_ITEM_WIDTHS = ["w-20", "w-24"] as const;

export const PropertiesSkeleton = () => (
  <PageShell>
    <PageHeaderSkeleton
      titleWidth="w-40"
      metaItemWidths={META_ITEM_WIDTHS}
      actions={<Skeleton className="h-8 w-32 rounded-md" />}
    />

    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: SKELETON_CARD_COUNT }).map((_, index) => (
        <PropertyCardSkeleton key={index} />
      ))}
    </div>
  </PageShell>
);

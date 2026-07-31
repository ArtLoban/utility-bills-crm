import { PageContainer } from "@/components/page-container";
import { PageMetaSkeleton } from "@/components/page-meta/components/page-meta-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

import { PropertyCardSkeleton } from "./components/property-card-skeleton";

const SKELETON_CARD_COUNT = 3;

export const PropertiesSkeleton = () => {
  return (
    <PageContainer
      title={<Skeleton className="h-8 w-40 md:h-9" />}
      actions={<Skeleton className="h-9 w-32 rounded-md" />}
      meta={<PageMetaSkeleton />}
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: SKELETON_CARD_COUNT }).map((_, index) => (
          <PropertyCardSkeleton key={index} />
        ))}
      </div>
    </PageContainer>
  );
};

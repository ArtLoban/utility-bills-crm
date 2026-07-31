import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonLine } from "@/components/skeleton-line";
import { SectionCard } from "@/components/section-card";

export const BalanceCardSkeleton = () => (
  <SectionCard>
    <div className="px-4 pt-6 pb-5 sm:px-6">
      <SkeletonLine size="xs" className="w-24" />
      <Skeleton className="mt-3 h-10 w-48" />
      <SkeletonLine size="sm" className="mt-2 w-40" />

      <div className="mt-5 flex flex-wrap gap-2">
        <Skeleton className="h-8 w-28 rounded-md" />
        <Skeleton className="h-8 w-36 rounded-md" />
      </div>
    </div>
  </SectionCard>
);

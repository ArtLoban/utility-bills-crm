import { Skeleton } from "@/components/ui/skeleton";
import { BalanceBlockSkeleton } from "./components/balance-block-skeleton";
import { ChartsSectionSkeleton } from "./components/charts-section-skeleton";

export const DashboardSkeleton = () => (
  <div className="mx-auto w-full max-w-[1360px] px-3.5 pt-5 pb-9 md:px-8 md:pt-8 md:pb-12">
    <Skeleton className="mb-5 h-6 w-32 rounded-lg md:mb-7 md:h-8 md:w-40" />
    <div className="flex flex-col gap-3.5 md:gap-5">
      <BalanceBlockSkeleton />
      <ChartsSectionSkeleton />
    </div>
  </div>
);

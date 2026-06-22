import { Skeleton } from "@/components/ui/skeleton";
import { PageShell } from "@/components/page-shell";
import { BalanceBlockSkeleton } from "./components/balance-block-skeleton";
import { ChartsSectionSkeleton } from "./components/charts-section-skeleton";

export const DashboardSkeleton = () => (
  <PageShell>
    <Skeleton className="mb-5 h-6 w-32 rounded-lg md:mb-7 md:h-8 md:w-40" />
    <div className="flex flex-col gap-3.5 md:gap-5">
      <BalanceBlockSkeleton />
      <ChartsSectionSkeleton />
    </div>
  </PageShell>
);

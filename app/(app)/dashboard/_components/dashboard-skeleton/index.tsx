import { Skeleton } from "@/components/ui/skeleton";
import { PageShell } from "@/components/page-shell";
import { AttentionBlockSkeleton } from "./components/attention-block-skeleton";
import { BalanceBlockSkeleton } from "./components/balance-block-skeleton";
import { ChartsSectionSkeleton } from "./components/charts-section-skeleton";

export const DashboardSkeleton = () => (
  <PageShell>
    <div className="mb-5 md:mb-7">
      <Skeleton className="h-8 w-32 md:h-9 md:w-40" />
    </div>

    <div className="flex flex-col gap-3.5 md:gap-5">
      <AttentionBlockSkeleton />
      <BalanceBlockSkeleton />
      <ChartsSectionSkeleton />
    </div>
  </PageShell>
);

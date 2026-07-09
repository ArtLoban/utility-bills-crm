import { Skeleton } from "@/components/ui/skeleton";
import { ChartCardSkeleton } from "./components/chart-card-skeleton";
import { PieChartSkeleton } from "./components/pie-chart-skeleton";

export const ChartsSectionSkeleton = () => (
  <div className="flex flex-col gap-4">
    {/* Mobile: analytics section header */}
    <div className="flex items-center justify-between md:hidden">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-3 w-16" />
    </div>

    {/* Desktop: filter bar */}
    <div className="bg-card hidden items-center gap-2 rounded-lg border px-3.5 py-3 md:flex">
      <Skeleton className="mr-1 h-3 w-11" />
      <Skeleton className="h-8 w-44 rounded-md" />
      <Skeleton className="h-8 w-40 rounded-md" />
      <Skeleton className="h-8 w-36 rounded-md" />
      <div className="flex-1" />
      <Skeleton className="h-3 w-28" />
    </div>

    {/* Desktop: pie + bar chart grid */}
    <div className="hidden gap-4 md:grid lg:grid-cols-[1fr_1.4fr]">
      <PieChartSkeleton />
      <ChartCardSkeleton titleClass="w-36" subClass="w-28" chartClass="h-52" />
    </div>

    {/* Desktop: line chart */}
    <div className="hidden md:block">
      <ChartCardSkeleton titleClass="w-40" subClass="w-32" chartClass="h-56" />
    </div>

    {/* Mobile: 3 stacked chart skeletons */}
    <div className="flex flex-col gap-4 md:hidden">
      <ChartCardSkeleton titleClass="w-32" subClass="w-24" chartClass="h-56" />
      <ChartCardSkeleton titleClass="w-36" subClass="w-24" chartClass="h-52" />
      <ChartCardSkeleton titleClass="w-36" subClass="w-28" chartClass="h-52" />
    </div>
  </div>
);

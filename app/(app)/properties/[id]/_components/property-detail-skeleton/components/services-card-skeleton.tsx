import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonLine } from "@/components/skeleton-line";
import { SectionCard } from "@/components/section-card";

const SERVICE_ROW_WIDTHS = [
  { name: "w-28", secondary: "w-40", amount: "w-16" },
  { name: "w-20", secondary: "w-32", amount: "w-14" },
  { name: "w-32", secondary: "w-36", amount: "w-12" },
  { name: "w-24", secondary: "w-44", amount: "w-16" },
] as const;

export const ServicesCardSkeleton = () => (
  <SectionCard
    className="overflow-hidden"
    title={<SkeletonLine size="sm" className="w-44" />}
    description={<SkeletonLine size="xs" className="mt-1 w-40" />}
    actions={<Skeleton className="h-7 w-28 rounded-md" />}
  >
    {SERVICE_ROW_WIDTHS.map((widths, index) => (
      <div
        key={index}
        className={cn(
          "flex items-center gap-4 px-4 py-4.5 sm:px-5",
          index < SERVICE_ROW_WIDTHS.length - 1 && "border-border border-b",
        )}
      >
        <Skeleton className="size-9 shrink-0 rounded-lg" />
        <div className="min-w-0 flex-1">
          <SkeletonLine size="sm" className={widths.name} />
          <SkeletonLine size="xs" className={cn("mt-0.5", widths.secondary)} />
        </div>
        <Skeleton className={cn("h-4 shrink-0", widths.amount)} />
        <Skeleton className="size-4 shrink-0 rounded-sm" />
      </div>
    ))}
  </SectionCard>
);

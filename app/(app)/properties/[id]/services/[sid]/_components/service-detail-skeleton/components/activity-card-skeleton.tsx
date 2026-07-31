import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonLine } from "@/components/skeleton-line";
import { SectionCard } from "@/components/section-card";
import { SectionCardHeaderSkeleton } from "@/components/section-card-header-skeleton";

const ACTIVITY_ROW_WIDTHS = [
  { label: "w-36", date: "w-20", amount: "w-16" },
  { label: "w-44", date: "w-24", amount: "w-14" },
  { label: "w-32", date: "w-20", amount: "w-16" },
  { label: "w-40", date: "w-24", amount: "w-12" },
  { label: "w-36", date: "w-20", amount: "w-16" },
  { label: "w-44", date: "w-24", amount: "w-14" },
] as const;

export const ActivityCardSkeleton = () => (
  <SectionCard>
    <SectionCardHeaderSkeleton titleWidth="w-24" />

    {ACTIVITY_ROW_WIDTHS.map((widths, index) => (
      <div
        key={index}
        className={cn(
          "flex items-center gap-3.5 px-4 py-3 sm:px-5",
          index < ACTIVITY_ROW_WIDTHS.length - 1 && "border-border border-b",
        )}
      >
        <Skeleton className="size-8 shrink-0 rounded-lg" />

        <div className="min-w-0 flex-1">
          <SkeletonLine size="sm" className={widths.label} />
          <SkeletonLine size="xs" className={widths.date} />
        </div>

        <Skeleton className={cn("h-4 shrink-0", widths.amount)} />
        <Skeleton className="size-3.5 shrink-0 rounded-sm" />
      </div>
    ))}
  </SectionCard>
);

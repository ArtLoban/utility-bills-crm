import { Skeleton } from "@/components/ui/skeleton";

export const PropertyCardSkeleton = () => {
  return (
    <div className="border-border bg-card rounded-lg border px-4 py-6 shadow-[0_1px_2px_0_rgba(24,24,27,0.05)] md:px-6 dark:shadow-none">
      <div className="flex items-start gap-3">
        <Skeleton className="h-9 w-9 shrink-0 rounded-lg" />
        <div className="min-w-0 flex-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="mt-1.5 h-3 w-40" />
        </div>
      </div>

      <div className="border-border mt-4 border-t pt-4">
        <Skeleton className="h-3 w-24" />
      </div>

      <div className="border-border mt-4 flex items-end justify-between border-t pt-4">
        <div>
          <Skeleton className="h-2.5 w-16" />
          <Skeleton className="mt-2 h-6 w-24" />
        </div>
        <Skeleton className="h-4 w-12" />
      </div>
    </div>
  );
};

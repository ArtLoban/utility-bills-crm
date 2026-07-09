import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Surface } from "@/components/surface";

const LEGEND_LABEL_CLASSES = ["w-20", "w-16", "w-24", "w-16", "w-14", "w-20"] as const;

export const PieChartSkeleton = () => (
  <Surface className="p-4 md:p-5">
    <Skeleton className="h-3.5 w-36" />
    <Skeleton className="mt-2 h-3 w-24" />
    <div className="mt-5 grid grid-cols-[192px_1fr] items-center gap-6">
      <Skeleton className="h-48 w-48 rounded-full" />
      <div className="flex flex-col gap-3.5">
        {LEGEND_LABEL_CLASSES.map((labelClass, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <Skeleton className="h-2.5 w-2.5 shrink-0 rounded-sm" />
            <Skeleton className={cn("h-3", labelClass)} />
            <div className="flex-1" />
            <Skeleton className="h-3 w-7" />
          </div>
        ))}
      </div>
    </div>
  </Surface>
);

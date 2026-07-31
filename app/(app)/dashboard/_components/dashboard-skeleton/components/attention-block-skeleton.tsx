import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonLine } from "@/components/skeleton-line";
import { Surface } from "@/components/surface";

const ATTENTION_ITEM_WIDTHS = ["w-48", "w-96"] as const;

export const AttentionBlockSkeleton = () => (
  <Surface elevation="sm" className="flex flex-col gap-3 border-l-4 px-4 py-5 shadow-xs md:px-6">
    <div className="flex items-center gap-2.5">
      <Skeleton className="size-4.5 shrink-0 rounded" />
      <SkeletonLine size="sm" className="w-32" />
    </div>

    <div className="flex flex-col gap-2.5">
      {ATTENTION_ITEM_WIDTHS.map((messageWidth) => (
        <div
          key={messageWidth}
          className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2.5"
        >
          <div className="flex flex-1 items-center gap-2.5">
            <Skeleton className="size-2 shrink-0 rounded-full" />
            <SkeletonLine size="sm" className={messageWidth} />
          </div>

          <SkeletonLine size="sm" className="ml-4.5 w-24 shrink-0 sm:ml-0" />
        </div>
      ))}
    </div>
  </Surface>
);

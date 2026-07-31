import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonLine } from "@/components/skeleton-line";
import { Surface } from "@/components/surface";

type TProps = {
  nameWidth: string;
};

export const ProviderCardSkeleton = ({ nameWidth }: TProps) => (
  <Surface className="flex flex-col gap-3 p-4 sm:px-5">
    <div className="flex items-start gap-4">
      <Skeleton className="size-9 shrink-0 rounded-xl sm:size-11" />

      <div className="min-w-0 flex-1">
        <SkeletonLine size="sm" className={cn("mb-1.5", nameWidth)} />
        <SkeletonLine size="xs" className="mb-1.5 w-52" />
        <SkeletonLine size="xs" className="w-28" />
      </div>

      <div className="flex shrink-0 items-center gap-1.5 pt-px">
        <Skeleton className="size-8 rounded-md" />
        <Skeleton className="size-8 rounded-md" />
      </div>
    </div>

    <SkeletonLine size="xs" className="mt-1 w-36" />
  </Surface>
);

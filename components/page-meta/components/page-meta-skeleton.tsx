import { Skeleton } from "@/components/ui/skeleton";

export const PageMetaSkeleton = () => (
  <div className="mt-1.5 flex items-center gap-2 text-sm">
    <Skeleton className="h-3.5 w-20" />
    <span className="text-zinc-300 dark:text-zinc-700">·</span>
    <Skeleton className="h-3.5 w-24" />
  </div>
);

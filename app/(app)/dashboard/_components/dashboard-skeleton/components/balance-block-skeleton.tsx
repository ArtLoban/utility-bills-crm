import { Skeleton } from "@/components/ui/skeleton";
import { DataCard } from "@/components/data-card";

const PROPERTY_NAME_CLASSES = ["w-48", "w-36", "w-32"] as const;

export const BalanceBlockSkeleton = () => (
  <DataCard className="overflow-hidden">
    <div className="border-b px-6 pt-5 pb-4 dark:border-zinc-800">
      <Skeleton className="h-3 w-28 rounded" />
      <div className="mt-4 grid grid-cols-2 gap-8">
        {[0, 1].map((i) => (
          <div key={i}>
            <Skeleton className="mb-3 h-3 w-20" />
            <Skeleton className="h-7 w-36 rounded-lg" />
            <Skeleton className="mt-3 h-3 w-24" />
          </div>
        ))}
      </div>
    </div>

    <div className="px-6 pt-3.5 pb-4">
      <Skeleton className="mb-3.5 h-2.5 w-16" />
      <div className="flex flex-col gap-4">
        {PROPERTY_NAME_CLASSES.map((nameClass, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-7 w-7 shrink-0 rounded-md" />
            <Skeleton className={`h-3.5 ${nameClass}`} />
            <div className="flex-1" />
            <Skeleton className="h-3.5 w-20" />
          </div>
        ))}
      </div>
    </div>
  </DataCard>
);

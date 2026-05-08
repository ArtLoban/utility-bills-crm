import { Skeleton } from "@/components/ui/skeleton";

export const ListPageSkeleton = () => {
  return (
    <div className="flex-1 bg-zinc-100 md:bg-white dark:bg-zinc-950 md:dark:bg-zinc-950">
      <div className="mx-auto w-full max-w-[1360px] px-8 pt-8 pb-12">
        <div className="mb-6 hidden md:block">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="mt-2 h-4 w-56" />
        </div>

        <div className="hidden md:block">
          <Skeleton className="mb-4 h-[52px] w-full rounded-lg" />
          <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
            <div className="h-10 border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900" />
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton
                key={i}
                className="h-[52px] rounded-none border-b border-zinc-100 dark:border-zinc-800/50"
                style={{ animationDelay: `${i * 40}ms` }}
              />
            ))}
          </div>
        </div>

        <div className="-mx-8 px-3.5 pt-5 pb-8 md:hidden">
          <Skeleton className="mb-3.5 h-[26px] w-28 bg-zinc-300 dark:bg-zinc-700" />
          <div className="flex flex-col gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton
                key={i}
                className="h-[72px] rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
                style={{ animationDelay: `${i * 40}ms` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

import { Skeleton } from "@/components/ui/skeleton";
import { PageMetaSkeleton } from "@/components/page-meta/components/page-meta-skeleton";
import { PageShell } from "@/components/page-shell";

const ROW_COUNT = 8;
const MOBILE_CARD_COUNT = 6;
const GRID_COLS = "120px 2fr 1.5fr 1fr 120px 48px";

export const ListPageSkeleton = () => {
  return (
    <PageShell>
      <div className="mb-5 md:mb-7">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Skeleton className="h-8 w-24 md:h-9 md:w-32" />
          <Skeleton className="h-8 w-24 rounded-md" />
        </div>
        <PageMetaSkeleton />
      </div>

      <div className="hidden md:block">
        <div className="mb-4 flex gap-2 rounded-lg border border-zinc-200 px-3.5 py-3 dark:border-zinc-800">
          <Skeleton className="h-8 w-40 rounded-md" />
          <Skeleton className="h-8 w-36 rounded-md" />
          <Skeleton className="h-8 w-36 rounded-md" />
          <Skeleton className="h-8 w-16 rounded-md" />
        </div>

        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <div
            className="grid h-11 items-center gap-4 border-b border-zinc-200 bg-zinc-50 px-5 dark:border-zinc-800 dark:bg-zinc-900"
            style={{ gridTemplateColumns: GRID_COLS }}
          >
            <Skeleton className="h-2.5 w-11" />
            <Skeleton className="h-2.5 w-16" />
            <Skeleton className="h-2.5 w-14" />
            <Skeleton className="h-2.5 w-12" />
            <Skeleton className="h-2.5 w-14 justify-self-end" />
            <Skeleton className="h-2.5 w-5 justify-self-center" />
          </div>

          {Array.from({ length: ROW_COUNT }).map((_, i) => (
            <div
              key={i}
              className="grid h-13 items-center gap-4 border-b border-zinc-100 px-5 last:border-0 dark:border-zinc-800/50"
              style={{
                gridTemplateColumns: GRID_COLS,
                animationDelay: `${i * 40}ms`,
              }}
            >
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-36" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-2 w-2 flex-shrink-0 rounded-sm" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-16 justify-self-end" />
              <Skeleton className="h-6 w-6 justify-self-center rounded-md" />
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <Skeleton className="h-3.5 w-44" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="pt-1 md:hidden">
        <div className="mb-3.5 flex items-center justify-between">
          <Skeleton className="h-8 w-24 rounded-md" />
          <Skeleton className="h-3 w-28" />
        </div>

        <div className="flex flex-col gap-2">
          {Array.from({ length: MOBILE_CARD_COUNT }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-white p-3.5 shadow-[0_1px_2px_rgba(24,24,27,0.04)] dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <Skeleton className="h-9 w-9 flex-shrink-0 rounded-lg" />
              <div className="min-w-0 flex-1">
                <div className="flex justify-between gap-2">
                  <Skeleton className="h-3.5 w-36" />
                  <Skeleton className="h-3.5 w-14 flex-shrink-0" />
                </div>
                <Skeleton className="mt-2.5 h-2.5 w-44" />
              </div>
              <Skeleton className="h-6 w-6 flex-shrink-0 rounded-md" />
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between rounded-lg border border-zinc-200 bg-white px-3.5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3.5 w-20" />
        </div>
      </div>
    </PageShell>
  );
};

import { TabNav } from "@/components/tab-nav";
import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonLine } from "@/components/skeleton-line";
import { TABS, TAB_CONFIG, type TTab } from "../../constants";

const LABEL_WIDTHS: Record<TTab, string> = {
  [TABS.OVERVIEW]: "w-16",
  [TABS.METERS]: "w-14",
  [TABS.SHARING]: "w-14",
};

export const TabsNavSkeleton = () => (
  <TabNav className="mb-5">
    {TAB_CONFIG.map(({ key }) => (
      <div key={key} className="relative mr-6 inline-flex items-center gap-1.5 px-1 py-2.5">
        <Skeleton className="size-4 shrink-0 rounded" />
        <SkeletonLine size="sm" className={LABEL_WIDTHS[key]} />
        {key === TABS.OVERVIEW && (
          <Skeleton className="absolute inset-x-0 bottom-0 h-0.5 rounded-full" />
        )}
      </div>
    ))}
  </TabNav>
);

import { TabNav } from "@/components/tab-nav";
import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonLine } from "@/components/skeleton-line";
import { tabNavItemClass } from "@/components/tab-nav/utils";

type TProps = {
  labelWidths: readonly string[];
  className?: string;
};

export const TabNavSkeleton = ({ labelWidths, className }: TProps) => (
  <TabNav className={className}>
    {labelWidths.map((width, index) => (
      <div key={index} className={tabNavItemClass(false)}>
        <Skeleton className="size-4 shrink-0 rounded" />
        <SkeletonLine size="sm" className={width} />
        {index === 0 && <Skeleton className="absolute inset-x-0 bottom-0 h-0.5 rounded-full" />}
      </div>
    ))}
  </TabNav>
);

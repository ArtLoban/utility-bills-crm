import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonLine } from "@/components/skeleton-line";
import { Surface } from "@/components/surface";

const BALANCE_COLUMNS = [
  { key: "debt", labelWidth: "w-16", amountWidth: "w-36", captionWidth: "w-24" },
  { key: "overpayment", labelWidth: "w-28", amountWidth: "w-32", captionWidth: "w-24" },
] as const;

const PROPERTY_NAME_WIDTHS = ["w-48", "w-36", "w-32"] as const;

export const BalanceBlockSkeleton = () => (
  <Surface elevation="sm" className="shadow-xs">
    <div className="border-b px-4 pt-5 pb-4 md:px-6">
      <SkeletonLine size="xs" className="w-28" />

      <div className="mt-3.5 grid grid-cols-2 gap-8">
        {BALANCE_COLUMNS.map(({ key, labelWidth, amountWidth, captionWidth }) => (
          <div key={key}>
            <SkeletonLine size="xs" className={cn("mb-1.5", labelWidth)} />
            <Skeleton className={cn("h-6 md:h-7.5", amountWidth)} />
            <SkeletonLine size="xs" className={cn("mt-1.5", captionWidth)} />
          </div>
        ))}
      </div>
    </div>

    <div>
      <div className="px-4 pt-3 pb-2 md:px-6">
        <SkeletonLine size="xs" className="w-20" />
      </div>

      {PROPERTY_NAME_WIDTHS.map((nameWidth, i) => (
        <div
          key={nameWidth}
          className={cn(
            "flex items-center gap-3 px-4 py-3 md:px-6",
            i < PROPERTY_NAME_WIDTHS.length - 1 && "border-border border-b",
          )}
        >
          <Skeleton className="size-8 shrink-0 rounded-md" />
          <SkeletonLine size="sm" className={nameWidth} />
          <SkeletonLine size="sm" className="ml-auto w-16" />
          <Skeleton className="size-3.5 shrink-0 rounded-sm" />
        </div>
      ))}
    </div>
  </Surface>
);

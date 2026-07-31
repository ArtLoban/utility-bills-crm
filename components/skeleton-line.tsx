import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const LINE_SIZES = {
  xs: { box: "h-4", bar: "h-2.5" },
  sm: { box: "h-5", bar: "h-3.5" },
} as const;

type TProps = {
  size: keyof typeof LINE_SIZES;
  className?: string;
};

export const SkeletonLine = ({ size, className }: TProps) => {
  const { box, bar } = LINE_SIZES[size];

  return (
    <div className={cn("flex items-center", box, className)}>
      <Skeleton className={cn("w-full", bar)} />
    </div>
  );
};

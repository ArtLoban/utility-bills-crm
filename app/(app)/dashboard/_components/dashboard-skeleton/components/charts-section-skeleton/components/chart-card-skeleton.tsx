import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Surface } from "@/components/surface";

type TProps = {
  titleClass: string;
  subClass: string;
  chartClass: string;
};

export const ChartCardSkeleton = ({ titleClass, subClass, chartClass }: TProps) => (
  <Surface className="p-5">
    <Skeleton className={cn("h-3.5", titleClass)} />
    <Skeleton className={cn("mt-2 h-3", subClass)} />
    <Skeleton className={cn("mt-4 w-full rounded-lg", chartClass)} />
  </Surface>
);

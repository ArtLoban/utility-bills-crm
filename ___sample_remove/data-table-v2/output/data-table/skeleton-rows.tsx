import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

type TProps = {
  rowCount: number;
  columnCount: number;
};

export const SkeletonRows = ({ rowCount, columnCount }: TProps) => {
  return (
    <TableBody>
      {Array.from({ length: rowCount }).map((_, rowIdx) => (
        <TableRow key={rowIdx}>
          {Array.from({ length: columnCount }).map((_, colIdx) => (
            <TableCell key={colIdx}>
              {/*
                style={{ animationDelay: "200ms" }} on the Skeleton's pulse
                ensures sub-200ms loads don't flash a skeleton. The shadcn
                Skeleton uses `animate-pulse`, which respects animation-delay.
              */}
              <Skeleton className="h-4 w-full" style={{ animationDelay: "200ms" }} />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );
};

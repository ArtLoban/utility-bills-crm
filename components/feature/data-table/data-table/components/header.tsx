import { flexRender, type Table } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

type TProps<T> = {
  table: Table<T>;
};

export const Header = <T,>({ table }: TProps<T>) => {
  return (
    <TableHeader>
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id}>
          {headerGroup.headers.map((header) => {
            const align = header.column.columnDef.meta?.align ?? "left";
            const width = header.column.columnDef.meta?.width;
            const headerClassName = header.column.columnDef.meta?.headerClassName;

            const canSort = header.column.getCanSort();
            const sortDir = header.column.getIsSorted();

            const SortIcon =
              sortDir === "asc" ? ArrowUp : sortDir === "desc" ? ArrowDown : ArrowUpDown;

            const isSorted = sortDir !== false;

            return (
              <TableHead
                key={header.id}
                style={width ? { width } : undefined}
                className={cn("select-none", canSort && "cursor-pointer", headerClassName)}
                onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
              >
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5",
                    align === "right" && "w-full justify-end",
                    align === "center" && "w-full justify-center",
                  )}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                  {canSort && (
                    <SortIcon
                      size={12}
                      className={cn(
                        "shrink-0",
                        isSorted ? "text-primary" : "text-muted-foreground/40",
                      )}
                      aria-hidden
                    />
                  )}
                </span>
              </TableHead>
            );
          })}
        </TableRow>
      ))}
    </TableHeader>
  );
};

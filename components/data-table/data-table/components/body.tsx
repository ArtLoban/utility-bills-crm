import { flexRender, type Table } from "@tanstack/react-table";

import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

type TProps<T> = {
  table: Table<T>;
};

export const Body = <T,>({ table }: TProps<T>) => {
  const { rows } = table.getRowModel();

  return (
    <TableBody>
      {rows.map((row) => (
        <TableRow key={row.id}>
          {row.getVisibleCells().map((cell) => {
            const align = cell.column.columnDef.meta?.align ?? "left";
            const cellClassName = cell.column.columnDef.meta?.cellClassName;

            return (
              <TableCell
                key={cell.id}
                className={cn(
                  align === "right" && "text-right",
                  align === "center" && "text-center",
                  cellClassName,
                )}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            );
          })}
        </TableRow>
      ))}
    </TableBody>
  );
};

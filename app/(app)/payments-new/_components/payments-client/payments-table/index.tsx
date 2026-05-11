"use client";

// TODO(mobile): UI_ARCHITECTURE.md requires card-list collapse on mobile.
// Not implemented in this task. Wire via media query / responsive hook in a follow-up.

import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, MoreHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

import { TPayment, TSortColumn } from "@/app/(app)/payments/_data/mock";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { usePaymentsFilters } from "../hooks/use-payments-filters";
import { PaymentsFooter } from "../payments-footer";
import { paymentColumns } from "./columns";

type TProps = {
  rows: TPayment[];
  onEditPayment: (payment: TPayment) => void;
};

const PaymentsTable = ({ rows, onEditPayment }: TProps) => {
  "use no memo"; // useReactTable returns mutable functions — React Compiler must not memoize this component
  const t = useTranslations("payments.list");
  const { state, toggleSort } = usePaymentsFilters();

  const sorting: SortingState = useMemo(
    () => [{ id: state.sortCol, desc: state.sortDir === "desc" }],
    [state.sortCol, state.sortDir],
  );

  const table = useReactTable({
    data: rows,
    columns: paymentColumns,
    state: { sorting },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualSorting: false,
    initialState: { pagination: { pageSize: 20 } },
  });

  return (
    <>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const align = header.column.columnDef.meta?.align ?? "left";
                const colId = header.column.id as TSortColumn;
                const isSorted = state.sortCol === header.column.id;
                const SortIcon = !isSorted
                  ? ArrowUpDown
                  : state.sortDir === "asc"
                    ? ArrowUp
                    : ArrowDown;

                return (
                  <TableHead
                    key={header.id}
                    className="cursor-pointer select-none"
                    onClick={() => toggleSort(colId)}
                  >
                    <span
                      className="inline-flex items-center gap-1.5"
                      style={{
                        justifyContent: align === "right" ? "flex-end" : "flex-start",
                        width: "100%",
                      }}
                    >
                      {t(header.column.columnDef.header as string)}
                      <SortIcon
                        size={12}
                        className={isSorted ? "text-primary" : "text-muted-foreground/40"}
                      />
                    </span>
                  </TableHead>
                );
              })}
              <TableHead className="w-12" />
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              className="cursor-pointer"
              onClick={() => onEditPayment(row.original)}
            >
              {row.getVisibleCells().map((cell) => {
                const align = cell.column.columnDef.meta?.align ?? "left";
                return (
                  <TableCell key={cell.id}>
                    <div style={{ textAlign: align }}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </div>
                  </TableCell>
                );
              })}
              <TableCell className="w-12" onClick={(e) => e.stopPropagation()}>
                <DropdownMenu>
                  <DropdownMenuTrigger className="hover:bg-accent data-popup-open:bg-accent flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-transparent bg-transparent transition-colors">
                    <MoreHorizontal size={16} className="text-muted-foreground" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem onClick={() => onEditPayment(row.original)}>
                      {t("actions.edit")}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {/* devnote: wire Delete when deletePayment server action is implemented */}
                    <DropdownMenuItem variant="destructive">{t("actions.delete")}</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <PaymentsFooter table={table} />
    </>
  );
};

export { PaymentsTable };

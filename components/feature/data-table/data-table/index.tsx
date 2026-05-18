"use client";

import { ReactNode, useEffect } from "react";
import {
  type ColumnDef,
  type SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnFiltersState,
} from "@tanstack/react-table";

import { Table } from "@/components/ui/table";

import { Body } from "./components/body";
import { Header } from "./components/header";
import { SkeletonRows } from "./components/skeleton-rows";
import { DEFAULT_PAGE_SIZE } from "./constants";
import { Footer } from "./components/footer";
import { useDataTablePagination } from "./hooks/use-data-table-pagination";
import { useDataTableSorting } from "./hooks/use-data-table-sorting";
import { TDefaultSorting } from "@/components/feature/data-table/data-table/types";
import type { Table as TodoNameTable } from "@tanstack/react-table";

type TDataTableProps<T> = {
  data: T[];
  columns: ColumnDef<T>[];
  columnFilters?: ColumnFiltersState;
  emptyState: ReactNode;
  filteredEmptyState?: ReactNode;
  isFiltered?: boolean;
  isLoading?: boolean;
  footerMeta?: ReactNode;
  defaultPageSize?: number;
  defaultSorting?: TDefaultSorting;
  onRowsChange?: (filteredRows: T[]) => void;
};

export const DataTable = <T,>(props: TDataTableProps<T>) => {
  const {
    data,
    columns,
    columnFilters,
    emptyState,
    filteredEmptyState,
    isFiltered = false,
    isLoading = false,
    footerMeta,
    defaultSorting,
    onRowsChange,
  } = props;

  const { pagination } = useDataTablePagination();
  const { sorting, setSorting } = useDataTableSorting(defaultSorting);

  const table = useReactTable<T>({
    data,
    columns,
    state: { pagination, sorting, columnFilters },
    onSortingChange: setSorting,
    enableMultiSort: false,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const filteredRows = table.getFilteredRowModel().rows;

  useEffect(() => {
    if (!onRowsChange) return;

    const rows = filteredRows.map((row) => row.original);
    onRowsChange(rows);
  }, [filteredRows, onRowsChange]);

  const rowCount = table.getRowModel().rows.length;
  const showEmpty = !isLoading && rowCount === 0;
  const emptyToRender = isFiltered && filteredEmptyState ? filteredEmptyState : emptyState;

  return (
    <div className="border-border overflow-hidden rounded-lg border">
      <Table>
        <Header table={table} />
        <Body table={table} />
      </Table>
      <Footer table={table} meta={footerMeta} />
    </div>
  );
};

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
import { DEFAULT_PAGE_SIZE } from "./constants";
import { Footer } from "./components/footer";
import { useDataTablePagination } from "./hooks/use-data-table-pagination";
import { useDataTableSorting } from "./hooks/use-data-table-sorting";
import { TDefaultSorting } from "@/components/data-table/data-table/types";
import { EmptyState } from "./components/empty-state";

type TDataTableProps<T> = {
  data: T[];
  columns: ColumnDef<T>[];
  columnFilters?: ColumnFiltersState;
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

  const isFiltered = (columnFilters?.length ?? 0) > 0;
  const showEmpty = !isLoading && filteredRows.length === 0;
  const emptyKind = data.length > 0 && isFiltered ? "noResults" : "empty";

  if (showEmpty) return <EmptyState kind={emptyKind} />;

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

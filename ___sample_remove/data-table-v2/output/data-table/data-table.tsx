"use client";

import type { ReactNode } from "react";
import {
  type ColumnDef,
  type SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Table } from "@/components/ui/table";

import { Body } from "./body";
import { Footer } from "./footer";
import { Header } from "./header";
import { SkeletonRows } from "./skeleton-rows";
import type { TUrlKeys } from "./types";
import { DEFAULT_PAGE_SIZE } from "./constants";
import { useTableUrlState } from "./use-table-url-state";

type TDataTableProps<TData> = {
  data: TData[];
  columns: ColumnDef<TData>[];

  emptyState: ReactNode;
  filteredEmptyState?: ReactNode;
  isFiltered?: boolean;

  isLoading?: boolean;

  footerMeta?: ReactNode;

  defaultPageSize?: number;
  defaultSorting?: SortingState;

  urlKeys?: TUrlKeys;
};

export const DataTable = <TData,>({
  data,
  columns,
  emptyState,
  filteredEmptyState,
  isFiltered = false,
  isLoading = false,
  footerMeta,
  defaultPageSize = DEFAULT_PAGE_SIZE,
  defaultSorting,
  urlKeys,
}: TDataTableProps<TData>) => {
  const { pagination, sorting, onPaginationChange, onSortingChange } = useTableUrlState({
    defaultPageSize,
    defaultSorting,
    urlKeys,
  });

  const table = useReactTable<TData>({
    data,
    columns,
    state: { pagination, sorting },
    onPaginationChange,
    onSortingChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const rowCount = table.getRowModel().rows.length;
  const showEmpty = !isLoading && rowCount === 0;
  const emptyToRender = isFiltered && filteredEmptyState ? filteredEmptyState : emptyState;

  return (
    <div className="border-border overflow-hidden rounded-lg border">
      <Table>
        <Header table={table} />
        {isLoading ? (
          <SkeletonRows rowCount={pagination.pageSize} columnCount={columns.length} />
        ) : showEmpty ? null : (
          <Body table={table} />
        )}
      </Table>

      {showEmpty && <div className="border-border border-t px-4 py-12">{emptyToRender}</div>}

      <Footer table={table} meta={footerMeta} />
    </div>
  );
};

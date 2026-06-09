"use client";

import type { ReactNode } from "react";
import {
  type ColumnDef,
  type SortingState,
  type Updater,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Table } from "@/components/ui/table";
import { Body } from "@/components/data-table/client-data-table/components/body";
import { Header } from "@/components/data-table/client-data-table/components/header";
import type { TServerPagination } from "@/lib/types/data-table";

import { ServerFooter } from "./server-footer";

type TProps<T> = {
  data: T[];
  columns: ColumnDef<T>[];
  // Sorting is controlled by the caller via URL state (useServerListParams).
  sorting: SortingState;
  onSortingChange: (updater: Updater<SortingState>) => void;
  // Pagination metadata from the backend response.
  pagination: TServerPagination;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  footerMeta?: ReactNode;
  emptyState?: ReactNode;
};

export const ServerDataTable = <T,>(props: TProps<T>) => {
  const {
    data,
    columns,
    sorting,
    onSortingChange,
    pagination,
    onPageChange,
    onPageSizeChange,
    footerMeta,
    emptyState,
  } = props;

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable<T>({
    data,
    columns,
    state: { sorting },
    onSortingChange,
    manualSorting: true,
    manualPagination: true,
    enableMultiSort: false,
    getCoreRowModel: getCoreRowModel(),
  });

  if (data.length === 0) {
    return emptyState ?? null;
  }

  return (
    <div className="border-border overflow-hidden rounded-lg border">
      <Table>
        <Header table={table} />
        <Body table={table} />
      </Table>
      <ServerFooter
        page={pagination.page}
        pageSize={pagination.pageSize}
        total={pagination.total}
        totalPages={pagination.totalPages}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        meta={footerMeta}
      />
    </div>
  );
};

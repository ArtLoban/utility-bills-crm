"use client";

import { Body } from "./components/body";
import { Header } from "./components/header";
import { Footer } from "./components/footer";
import { ColumnDef, useReactTable, getCoreRowModel } from "@tanstack/react-table";
import { TServerPagination } from "@/lib/types/data-table";
import { Table } from "@/components/ui/table";
import { ReactNode } from "react";
import { TListParams } from "../types";
import { EmptyState } from "@/components/data-table/components/empty-state";

type TProps<T> = {
  data: T[];
  columns: ColumnDef<T>[];
  pagination: TServerPagination;
  listParams: TListParams;
  footerMeta?: ReactNode;
  hasActiveFilters?: boolean;
};

export const ServerTableGroup = <T,>(props: TProps<T>) => {
  const { data, columns, pagination, listParams, footerMeta, hasActiveFilters } = props;
  const { sorting, setPage, setPageSize, onSortingChange } = listParams;

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable<T>({
    data,
    columns,
    state: { sorting },
    onSortingChange,
    manualSorting: true,
    manualPagination: true,
    enableMultiSort: false,
    enableSortingRemoval: false,
    getCoreRowModel: getCoreRowModel(),
  });

  const noData = data.length === 0;
  const emptyKind = noData && hasActiveFilters ? "noResults" : "empty";

  if (noData) return <EmptyState kind={emptyKind} />;

  return (
    <div className="border-border overflow-hidden rounded-lg border">
      <Table>
        <Header table={table} />
        <Body table={table} />
      </Table>
      <Footer
        pagination={pagination}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        meta={footerMeta}
      />
    </div>
  );
};

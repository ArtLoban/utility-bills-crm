"use client";

import type { ReactNode } from "react";
import type { Table } from "@tanstack/react-table";

import { PageSizeSelector } from "./page-size-selector";
import { Pagination } from "./pagination";

type TProps<T> = {
  table: Table<T>;
  meta?: ReactNode;
};

export const Footer = <T,>({ table, meta }: TProps<T>) => {
  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;
  const pageCount = table.getPageCount();

  return (
    <div className="border-border bg-muted/50 flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3.5">
      <div className="min-w-0 flex-1">{meta}</div>
      <div className="flex items-center gap-3">
        <PageSizeSelector value={pageSize} onChange={(size) => table.setPageSize(size)} />
        <Pagination
          page={pageIndex + 1}
          pageCount={pageCount}
          canPreviousPage={table.getCanPreviousPage()}
          canNextPage={table.getCanNextPage()}
          onPageChange={(p) => table.setPageIndex(p - 1)}
        />
      </div>
    </div>
  );
};

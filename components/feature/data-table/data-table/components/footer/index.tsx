"use client";

import type { ReactNode } from "react";
import type { Table } from "@tanstack/react-table";

import { PageSizeSelector } from "./components/page-size-selector";
import { TablePagination } from "./components/table-pagination";
import { useFooter } from "./hooks/use-footer";

type TProps<T> = {
  table: Table<T>;
  meta?: ReactNode;
};

export const Footer = <T,>({ table, meta }: TProps<T>) => {
  const { pageSize, ...pagination } = useFooter(table);

  return (
    <div className="border-border bg-muted/50 flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3.5">
      <div className="min-w-0 flex-1">{meta}</div>
      <div className="flex items-center gap-3">
        <PageSizeSelector value={pageSize} />
        <TablePagination {...pagination} />
      </div>
    </div>
  );
};

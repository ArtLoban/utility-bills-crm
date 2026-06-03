"use client";

import type { ReactNode } from "react";

import { PageSizeSelector } from "./components/page-size-selector";
import { TablePagination } from "./components/table-pagination";
import { TServerPagination } from "@/lib/types/data-table";

type TProps = {
  pagination: TServerPagination;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  meta?: ReactNode;
};

export const Footer = (props: TProps) => {
  const { pagination, onPageChange, onPageSizeChange, meta } = props;
  const { page, totalPages, pageSize } = pagination;

  return (
    <div className="border-border bg-muted/50 flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3.5">
      <div className="min-w-0 flex-1">{meta}</div>
      <div className="flex items-center gap-3">
        <PageSizeSelector value={pageSize} onChange={onPageSizeChange} />
        <TablePagination page={page} totalPages={totalPages} onChange={onPageChange} />
      </div>
    </div>
  );
};

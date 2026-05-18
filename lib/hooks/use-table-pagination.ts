import type { Table } from "@tanstack/react-table";
import { TPagination } from "@/lib/types/data-table";

export const useTablePagination = <T>(table: Table<T>): TPagination => {
  const { pageIndex, pageSize } = table.getState().pagination;
  const pageCount = table.getPageCount() || 1;
  const currentPage = pageIndex + 1;

  return {
    page: currentPage,
    pageSize,
    pageCount,
    onPageChange: (p) => table.setPageIndex(p - 1),
    onPageSizeChange: (size) => table.setPageSize(size),
    canPreviousPage: table.getCanPreviousPage(),
    canNextPage: table.getCanNextPage(),
  };
};

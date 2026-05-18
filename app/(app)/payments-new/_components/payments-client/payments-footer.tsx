"use client";

import type { Table } from "@tanstack/react-table";
import { useTranslations } from "next-intl";

import { TPayment } from "@/app/(app)/payments/_data/mock";
import { formatUAH } from "@/lib/format/currency";
import { PageSizeSelector } from "./page-size-selector";
import { TablePagination } from "./payments-table/table-pagination";

type TProps = {
  table: Table<TPayment>;
};

export const PaymentsFooter = ({ table }: TProps) => {
  const t = useTranslations("payments.list");

  const filteredTotal = table
    .getFilteredRowModel()
    .rows.reduce((sum, row) => sum + row.original.amount, 0);

  const { pageIndex, pageSize } = table.getState().pagination;
  const pageCount = table.getPageCount() || 1;
  const currentPage = pageIndex + 1;

  return (
    <div className="border-border bg-muted/50 flex items-center justify-between border-t px-4 py-3.5">
      <span className="text-muted-foreground text-sm">
        {t("footer.totalPaid")}:{" "}
        <span className="font-bold text-green-600 tabular-nums dark:text-green-500">
          {formatUAH(filteredTotal)}
        </span>
      </span>

      <div className="flex items-center gap-3">
        <PageSizeSelector value={pageSize} onChange={(size) => table.setPageSize(size)} />
        <TablePagination
          page={currentPage}
          pageCount={pageCount}
          onPageChange={(p) => table.setPageIndex(p - 1)}
          canPreviousPage={table.getCanPreviousPage()}
          canNextPage={table.getCanNextPage()}
        />
      </div>
    </div>
  );
};

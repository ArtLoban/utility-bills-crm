"use client";

import type { Table } from "@tanstack/react-table";
import { useTranslations } from "next-intl";

import { TPayment } from "@/app/(app)/payments/_data/mock";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatUAH } from "@/lib/format/currency";

const PAGE_SIZES = [10, 20, 50, 100] as const;

type TProps = {
  table: Table<TPayment>;
};

const PaymentsFooter = ({ table }: TProps) => {
  const t = useTranslations("payments.list");

  const filteredTotal = table
    .getFilteredRowModel()
    .rows.reduce((sum, row) => sum + row.original.amount, 0);

  const { pageIndex, pageSize } = table.getState().pagination;
  const pageCount = table.getPageCount();

  return (
    <div className="border-border flex items-center justify-between border-t px-4 py-3">
      <span className="text-sm font-medium text-green-600 tabular-nums dark:text-green-500">
        {t("footer.totalFiltered")}: {formatUAH(filteredTotal)}
      </span>

      <div className="flex items-center gap-3">
        <Select value={String(pageSize)} onValueChange={(v) => table.setPageSize(Number(v))}>
          <SelectTrigger size="sm" className="w-[130px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PAGE_SIZES.map((size) => (
              <SelectItem key={size} value={String(size)}>
                {t("footer.perPage", { count: size })}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {t("footer.prev")}
          </Button>
          <span className="text-muted-foreground min-w-[80px] text-center text-sm">
            {t("footer.page", { page: pageIndex + 1, total: pageCount || 1 })}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {t("footer.next")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export { PaymentsFooter };

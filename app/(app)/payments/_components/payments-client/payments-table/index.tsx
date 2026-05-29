"use client";

import type { SortingState, Updater } from "@tanstack/react-table";
import { useTranslations } from "next-intl";

import { ServerDataTable } from "@/components/data-table/server-data-table";
import type { TServerPagination } from "@/lib/types/data-table";
import type { TPaymentGlobalRow } from "@/features/payments/types";

import { getPaymentsColumns } from "./utils/get-table-columns";
import { FooterMeta } from "./components/footer-meta";

type TProps = {
  data: TPaymentGlobalRow[];
  pagination: TServerPagination;
  totalAmount: string;
  sorting: SortingState;
  onSortingChange: (updater: Updater<SortingState>) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
};

export const PaymentsTable = ({
  data,
  pagination,
  totalAmount,
  sorting,
  onSortingChange,
  onPageChange,
  onPageSizeChange,
}: TProps) => {
  const t = useTranslations("payments.list");
  const columns = getPaymentsColumns(t);

  return (
    <ServerDataTable
      data={data}
      columns={columns}
      sorting={sorting}
      onSortingChange={onSortingChange}
      pagination={pagination}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      footerMeta={<FooterMeta totalAmount={totalAmount} />}
    />
  );
};

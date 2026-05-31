"use client";

import type { SortingState, Updater } from "@tanstack/react-table";
import { useTranslations } from "next-intl";

import { ServerDataTable } from "@/components/data-table/server-data-table";
import type { TServerPagination } from "@/lib/types/data-table";
import type { TAdminPropertyRow } from "@/features/admin-properties";

import { getPropertyColumns } from "./utils/get-property-columns";
import { FooterMeta } from "./components/footer-meta";

type TProps = {
  data: TAdminPropertyRow[];
  pagination: TServerPagination;
  sorting: SortingState;
  onSortingChange: (updater: Updater<SortingState>) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
};

export const PropertiesTable = ({
  data,
  pagination,
  sorting,
  onSortingChange,
  onPageChange,
  onPageSizeChange,
}: TProps) => {
  const t = useTranslations("adminProperties");
  const columns = getPropertyColumns(t);

  return (
    <ServerDataTable
      data={data}
      columns={columns}
      sorting={sorting}
      onSortingChange={onSortingChange}
      pagination={pagination}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      footerMeta={<FooterMeta total={pagination.total} />}
    />
  );
};

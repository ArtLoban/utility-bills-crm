"use client";

import type { SortingState, Updater } from "@tanstack/react-table";

import { ServerDataTable } from "@/components/data-table/server-data-table";
import type { TServerPagination } from "@/lib/types/data-table";
import type { TAdminUserRow } from "@/features/admin-users/types";

import { getUserColumns } from "./utils/get-user-columns";
import { FooterMeta } from "./components/footer-meta";

type TProps = {
  data: TAdminUserRow[];
  pagination: TServerPagination;
  sorting: SortingState;
  onSortingChange: (updater: Updater<SortingState>) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
};

export const UsersTable = ({
  data,
  pagination,
  sorting,
  onSortingChange,
  onPageChange,
  onPageSizeChange,
}: TProps) => {
  const columns = getUserColumns();

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

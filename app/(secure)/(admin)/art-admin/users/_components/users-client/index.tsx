"use client";

import { PageContainer } from "@/components/page-container";
import { PageMeta } from "@/components/page-meta";
import type { TAdminUserRow } from "@/features/admin-users/types";
import type { TServerPagination } from "@/lib/types/data-table";

import { UsersTable } from "./components/users-table";
import { formatUserCount } from "./components/users-table/utils/format-user-count";

type TProps = {
  data: TAdminUserRow[];
  pagination: TServerPagination;
};

export const UsersClient = ({ data, pagination }: TProps) => (
  <PageContainer title="All users" meta={<PageMeta items={[formatUserCount(pagination.total)]} />}>
    <UsersTable data={data} pagination={pagination} />
  </PageContainer>
);

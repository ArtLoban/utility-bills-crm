"use client";

import { useState } from "react";

import { PageContainer } from "@/components/page-container";
import { PageMeta } from "@/components/page-meta";
import { ALL_USERS, TAdminUser } from "../../_data/mock";

import { UsersTable } from "./users-table";
import { UsersMobile } from "./users-mobile";

export const UsersClient = () => {
  const [filteredRows, setFilteredRows] = useState<TAdminUser[] | null>(null);

  const metaItems =
    filteredRows !== null
      ? [
          `${filteredRows.length} users`,
          `${filteredRows.filter((u) => u.status === "active").length} active`,
        ]
      : null;

  return (
    <PageContainer title="All users" meta={<PageMeta items={metaItems} />}>
      <UsersTable data={ALL_USERS} filteredData={filteredRows} setFilteredData={setFilteredRows} />

      <div className="-mx-8 md:hidden">
        <UsersMobile users={ALL_USERS} />
      </div>
    </PageContainer>
  );
};

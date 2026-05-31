"use client";

import { FilterX, Users } from "lucide-react";
import { parseAsString, useQueryStates } from "nuqs";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { EmptyStateCard } from "@/components/empty-state-card";
import { PageContainer } from "@/components/page-container";
import { PageMeta } from "@/components/page-meta";
import { useServerListParams } from "@/lib/hooks/use-server-list-params";
import type { TAdminUserRow } from "@/features/admin-users/types";
import type { TServerPagination } from "@/lib/types/data-table";

import { FiltersBar } from "./users-table/components/filters-bar";
import { UsersTable } from "./users-table";
import { UsersMobile } from "./users-mobile";

type TProps = {
  data: TAdminUserRow[];
  pagination: TServerPagination;
};

export const UsersClient = ({ data, pagination }: TProps) => {
  const t = useTranslations("adminUsers");
  const { sorting, onSortingChange, setPage, setPageSize } = useServerListParams({
    defaultSortBy: "createdAt",
    defaultSortOrder: "desc",
  });

  const [filterParams, setFilterParams] = useQueryStates(
    { systemRole: parseAsString, status: parseAsString },
    { history: "replace", shallow: false },
  );
  const anyFilter = Boolean(filterParams.systemRole || filterParams.status);

  const handleClearFilters = () => void setFilterParams({ systemRole: null, status: null });

  return (
    <PageContainer
      title={t("title")}
      meta={<PageMeta items={[t("meta.total", { count: pagination.total })]} />}
    >
      {/* Desktop */}
      <div className="hidden md:block">
        {(data.length > 0 || anyFilter) && <FiltersBar />}

        {data.length === 0 && !anyFilter && (
          <EmptyStateCard icon={Users} title={t("title")} body="" />
        )}

        {data.length === 0 && anyFilter && (
          <EmptyStateCard
            icon={FilterX}
            title={t("empty.filtered.title")}
            cta={
              <Button variant="outline" className="h-9" onClick={handleClearFilters}>
                {t("empty.filtered.cta")}
              </Button>
            }
          />
        )}

        {data.length > 0 && (
          <UsersTable
            data={data}
            pagination={pagination}
            sorting={sorting}
            onSortingChange={onSortingChange}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        )}
      </div>

      {/* Mobile */}
      <div className="-mx-8 md:hidden">
        <UsersMobile data={data} pagination={pagination} onPageChange={setPage} />
      </div>
    </PageContainer>
  );
};

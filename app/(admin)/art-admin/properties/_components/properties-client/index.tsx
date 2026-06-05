"use client";

import { useState } from "react";
import { FilterX, Home } from "lucide-react";
import { parseAsString, useQueryStates } from "nuqs";

import { Button } from "@/components/ui/button";
import { EmptyStateCard } from "@/components/empty-state-card";
import { PageContainer } from "@/components/page-container";
import { PageMeta } from "@/components/page-meta";
import { useServerListParams } from "@/lib/hooks/use-server-list-params";
import type { TAdminPropertyRow } from "@/features/admin-properties";
import type { TServerPagination } from "@/lib/types/data-table";

import { RestoreDialog } from "@/app/(admin)/art-admin/properties/[id]/_components/restore-dialog";
import { HardDeleteDialog } from "@/app/(admin)/art-admin/properties/[id]/_components/hard-delete-dialog";
import { PropertiesTableProvider } from "./context";
import { FilterBar } from "./filter-bar";
import { PropertiesTable } from "./properties-table";
import { PropertiesMobile } from "./properties-mobile";

type TProps = {
  data: TAdminPropertyRow[];
  pagination: TServerPagination;
  ownerName: string | null;
};

export const PropertiesClient = ({ data, pagination, ownerName }: TProps) => {
  const { sorting, onSortingChange, setPage, setPageSize } = useServerListParams({
    defaultSortBy: "createdAt",
    defaultSortOrder: "desc",
  });

  const [filterParams, setFilterParams] = useQueryStates(
    { status: parseAsString, type: parseAsString, owner: parseAsString },
    { history: "replace", shallow: false },
  );
  const anyFilter = Boolean(filterParams.status || filterParams.type || filterParams.owner);

  const handleClearFilters = () => void setFilterParams({ status: null, type: null, owner: null });

  const [selectedRow, setSelectedRow] = useState<TAdminPropertyRow | null>(null);
  const [restoreOpen, setRestoreOpen] = useState(false);
  const [hardDeleteOpen, setHardDeleteOpen] = useState(false);

  const openRestore = (row: TAdminPropertyRow) => {
    setSelectedRow(row);
    setRestoreOpen(true);
  };

  const openHardDelete = (row: TAdminPropertyRow) => {
    setSelectedRow(row);
    setHardDeleteOpen(true);
  };

  return (
    <PropertiesTableProvider value={{ openRestore, openHardDelete }}>
      <PageContainer
        title="All properties"
        meta={
          <PageMeta
            items={[pagination.total === 1 ? "1 property" : `${pagination.total} properties`]}
          />
        }
      >
        {/* Desktop */}
        <div className="hidden md:block">
          {(data.length > 0 || anyFilter) && <FilterBar ownerName={ownerName} />}

          {data.length === 0 && !anyFilter && (
            <EmptyStateCard icon={Home} title="All properties" body="" />
          )}

          {data.length === 0 && anyFilter && (
            <EmptyStateCard
              icon={FilterX}
              title="No properties match your filters"
              cta={
                <Button variant="outline" className="h-9" onClick={handleClearFilters}>
                  Clear filters
                </Button>
              }
            />
          )}

          {data.length > 0 && (
            <PropertiesTable
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
          <PropertiesMobile data={data} pagination={pagination} onPageChange={setPage} />
        </div>
      </PageContainer>

      {selectedRow && (
        <>
          <RestoreDialog
            open={restoreOpen}
            onOpenChange={setRestoreOpen}
            propertyId={selectedRow.id}
            propertyName={selectedRow.name}
          />
          <HardDeleteDialog
            open={hardDeleteOpen}
            onOpenChange={setHardDeleteOpen}
            propertyId={selectedRow.id}
            propertyName={selectedRow.name}
          />
        </>
      )}
    </PropertiesTableProvider>
  );
};

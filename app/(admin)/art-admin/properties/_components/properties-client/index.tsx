"use client";

import { PageContainer } from "@/components/page-container";
import { PageMeta } from "@/components/page-meta";
import { ACTIVE_COUNT, DELETED_COUNT } from "@/app/(admin)/art-admin/properties/_data/mock";
import { usePropertiesList } from "./hooks/use-properties-list";
import { FilterBar } from "./filter-bar";
import { PropertiesTable } from "./properties-table";
import { PropertiesFooter } from "./properties-footer";
import { PropertiesMobile } from "./properties-mobile";

export const PropertiesClient = () => {
  const { filters, sortCol, sortDir, rows, anyFilter, handleFilterChange, handleSort } =
    usePropertiesList();

  return (
    <PageContainer
      title="All properties"
      meta={<PageMeta items={[`${ACTIVE_COUNT} active`, `${DELETED_COUNT} soft-deleted`]} />}
    >
      {/* Desktop layout */}
      <div className="hidden md:block">
        <FilterBar filters={filters} onFilterChange={handleFilterChange} anyFilter={anyFilter} />

        <div className="overflow-hidden rounded-lg border border-zinc-200 shadow-[0_1px_2px_0_rgba(24,24,27,0.05)] dark:border-zinc-800 dark:shadow-none">
          <PropertiesTable rows={rows} sortCol={sortCol} sortDir={sortDir} onSort={handleSort} />
          <PropertiesFooter />
        </div>
      </div>

      {/* Mobile layout */}
      <div className="-mx-8 md:hidden">
        <PropertiesMobile rows={rows} />
      </div>
    </PageContainer>
  );
};

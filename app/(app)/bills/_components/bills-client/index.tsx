"use client";

import { FilterX, Receipt } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EmptyStateCard } from "@/components/empty-state-card";
import { PageContainer } from "@/components/page-container";
import { PageMeta } from "@/components/page-meta";
import { useBillsList } from "./hooks/use-bills-list";
import { FilterBar } from "./filter-bar";
import { BillsTable } from "./bills-table";
import { BillsFooter } from "./bills-footer";
import { BillsMobile } from "./bills-mobile";
import { BillsActions } from "../bills-actions";

export const BillsClient = () => {
  const {
    filters,
    sortCol,
    sortDir,
    page,
    setPage,
    perPage,
    filteredBills,
    totalPages,
    pageRows,
    total,
    anyFilter,
    handleFilterChange,
    handleSort,
    handlePerPageChange,
  } = useBillsList();

  return (
    <PageContainer
      title="Bills"
      meta={<PageMeta items={[`${filteredBills.length} records`]} />}
      actions={<BillsActions />}
    >
      {/* Desktop layout */}
      <div className="hidden md:block">
        {(filteredBills.length > 0 || anyFilter) && (
          <FilterBar filters={filters} onFilterChange={handleFilterChange} anyFilter={anyFilter} />
        )}

        {filteredBills.length === 0 && !anyFilter && (
          <EmptyStateCard
            icon={<Receipt size={36} strokeWidth={1.5} className="text-zinc-400" />}
            title="No bills yet"
            body="Record your first bill to start tracking expenses."
          />
        )}

        {filteredBills.length === 0 && anyFilter && (
          <EmptyStateCard
            icon={<FilterX size={36} strokeWidth={1.5} className="text-zinc-400" />}
            title="No bills match your filters"
            body="Try adjusting period, property, or service filters."
            cta={
              <Button
                variant="outline"
                className="h-9"
                onClick={() =>
                  handleFilterChange({ property: "all", service: "all", period: "last12" })
                }
              >
                Clear filters
              </Button>
            }
          />
        )}

        {filteredBills.length > 0 && (
          <div className="overflow-hidden rounded-lg border border-zinc-200 shadow-[0_1px_2px_0_rgba(24,24,27,0.05)] dark:border-zinc-800 dark:shadow-none">
            <BillsTable rows={pageRows} sortCol={sortCol} sortDir={sortDir} onSort={handleSort} />
            <BillsFooter
              total={total}
              page={page}
              totalPages={totalPages}
              perPage={perPage}
              onPageChange={setPage}
              onPerPageChange={handlePerPageChange}
            />
          </div>
        )}
      </div>

      {/* Mobile layout */}
      <div className="-mx-8 md:hidden">
        <BillsMobile
          filters={filters}
          onFilterChange={handleFilterChange}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          total={total}
          pageRows={pageRows}
        />
      </div>
    </PageContainer>
  );
};

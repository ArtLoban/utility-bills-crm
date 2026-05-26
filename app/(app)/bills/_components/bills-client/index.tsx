"use client";

import { FilterX, Receipt } from "lucide-react";
import { useMemo } from "react";

import { Button } from "@/components/ui/button";
import { EmptyStateCard } from "@/components/empty-state-card";
import { PageContainer } from "@/components/page-container";
import { PageMeta } from "@/components/page-meta";
import { getServiceLabel } from "@/lib/constants/service-colors";
import type { PropertyId } from "@/lib/db/schema/properties";
import type { TBillGlobalRow, TServiceOption } from "@/lib/db/access/bills";
import { useBillsList } from "./hooks/use-bills-list";
import { FilterBar } from "./filter-bar";
import { BillsTable } from "./bills-table";
import { BillsFooter } from "./bills-footer";
import { BillsMobile } from "./bills-mobile";
import { BillsActions } from "../bills-actions";
import { BillsTableActions } from "./context";

type TProps = {
  initialBills: TBillGlobalRow[];
  serviceOptions: Record<PropertyId, TServiceOption[]>;
};

export const BillsClient = ({ initialBills, serviceOptions }: TProps) => {
  // Derive property options from serviceOptions (all properties with at least one service).
  const propertyOptions = useMemo(() => {
    const seen = new Set<string>();
    const result: { id: PropertyId; name: string }[] = [];
    // Property names are embedded in the bills themselves; cross-reference with initialBills.
    for (const bill of initialBills) {
      if (!seen.has(bill.property.id)) {
        seen.add(bill.property.id);
        result.push(bill.property);
      }
    }
    // Also include properties that have services but no bills yet.
    for (const propId of Object.keys(serviceOptions) as PropertyId[]) {
      if (!seen.has(propId)) {
        seen.add(propId);
        // Property name not available here — only show in filter if it has bills.
        // Omit silently; user will see it once they add a bill for that property.
      }
    }
    return result;
  }, [initialBills, serviceOptions]);

  // Derive unique service filter options from all bills in the list.
  const serviceFilterOptions = useMemo(() => {
    const seen = new Set<string>();
    const result: { id: string; name: string }[] = [];
    for (const bill of initialBills) {
      if (!seen.has(bill.serviceTypeCode)) {
        seen.add(bill.serviceTypeCode);
        result.push({ id: bill.serviceTypeCode, name: getServiceLabel(bill.serviceTypeCode) });
      }
    }
    return result;
  }, [initialBills]);

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
  } = useBillsList(initialBills);

  return (
    <BillsTableActions propertyOptions={propertyOptions} serviceOptions={serviceOptions}>
      <PageContainer
        title="Bills"
        meta={<PageMeta items={[`${filteredBills.length} records`]} />}
        actions={<BillsActions propertyOptions={propertyOptions} serviceOptions={serviceOptions} />}
      >
        {/* Desktop layout */}
        <div className="hidden md:block">
          {(filteredBills.length > 0 || anyFilter) && (
            <FilterBar
              filters={filters}
              onFilterChange={handleFilterChange}
              anyFilter={anyFilter}
              propertyOptions={propertyOptions}
              serviceOptions={serviceFilterOptions}
            />
          )}

          {filteredBills.length === 0 && !anyFilter && (
            <EmptyStateCard
              icon={Receipt}
              title="No bills yet"
              body="Record your first bill to start tracking expenses."
            />
          )}

          {filteredBills.length === 0 && anyFilter && (
            <EmptyStateCard
              icon={FilterX}
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
            propertyOptions={propertyOptions}
            serviceOptions={serviceFilterOptions}
          />
        </div>
      </PageContainer>
    </BillsTableActions>
  );
};

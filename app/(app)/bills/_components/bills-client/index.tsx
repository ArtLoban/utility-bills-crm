"use client";

import { FilterX, Receipt } from "lucide-react";
import { useMemo } from "react";
import { parseAsString, useQueryStates } from "nuqs";

import { Button } from "@/components/ui/button";
import { EmptyStateCard } from "@/components/empty-state-card";
import { PageContainer } from "@/components/page-container";
import { PageMeta } from "@/components/page-meta";
import { getServiceLabel } from "@/lib/constants/service-colors";
import { useServerListParams } from "@/lib/hooks/use-server-list-params";
import type { PropertyId } from "@/lib/db/schema/properties";
import type { TBillGlobalRow, TServiceOption } from "@/lib/db/access/bills";
import type { TServerPagination } from "@/lib/types/data-table";
import { FilterBar } from "./filter-bar";
import { BillsTable } from "./bills-table";
import { BillsMobile } from "./bills-mobile";
import { BillsActions } from "../bills-actions";
import { BillsTableActions } from "./context";

type TProps = {
  data: TBillGlobalRow[];
  pagination: TServerPagination;
  serviceOptions: Record<PropertyId, TServiceOption[]>;
  propertyOptions: { id: PropertyId; name: string }[];
};

export const BillsClient = ({ data, pagination, serviceOptions, propertyOptions }: TProps) => {
  const { sorting, onSortingChange, setPage, setPageSize } = useServerListParams({
    defaultSortBy: "periodMonth",
  });

  // Read filter state to distinguish "no bills yet" from "no matching bills".
  const [filterParams, setFilterParams] = useQueryStates(
    { propertyId: parseAsString, service: parseAsString, period: parseAsString },
    { history: "replace", shallow: false },
  );
  const anyFilter = Boolean(filterParams.propertyId || filterParams.service || filterParams.period);

  // Derive unique service type options from all accessible services (not from current page data).
  const serviceFilterOptions = useMemo(() => {
    const seen = new Set<string>();
    const result: { id: string; name: string }[] = [];
    for (const options of Object.values(serviceOptions)) {
      for (const opt of options) {
        if (!seen.has(opt.typeCode)) {
          seen.add(opt.typeCode);
          result.push({ id: opt.typeCode, name: getServiceLabel(opt.typeCode) });
        }
      }
    }
    return result;
  }, [serviceOptions]);

  const handleClearFilters = () =>
    void setFilterParams({ propertyId: null, service: null, period: null });

  return (
    <BillsTableActions>
      <PageContainer
        title="Bills"
        meta={<PageMeta items={[`${pagination.total} records`]} />}
        actions={<BillsActions />}
      >
        {/* Desktop layout */}
        <div className="hidden md:block">
          {(data.length > 0 || anyFilter) && (
            <FilterBar propertyOptions={propertyOptions} serviceOptions={serviceFilterOptions} />
          )}

          {data.length === 0 && !anyFilter && (
            <EmptyStateCard
              icon={Receipt}
              title="No bills yet"
              body="Record your first bill to start tracking expenses."
            />
          )}

          {data.length === 0 && anyFilter && (
            <EmptyStateCard
              icon={FilterX}
              title="No bills match your filters"
              body="Try adjusting period, property, or service filters."
              cta={
                <Button variant="outline" className="h-9" onClick={handleClearFilters}>
                  Clear filters
                </Button>
              }
            />
          )}

          {data.length > 0 && (
            <BillsTable
              data={data}
              pagination={pagination}
              sorting={sorting}
              onSortingChange={onSortingChange}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
            />
          )}
        </div>

        {/* Mobile layout */}
        <div className="-mx-8 md:hidden">
          <BillsMobile
            data={data}
            pagination={pagination}
            propertyOptions={propertyOptions}
            serviceOptions={serviceFilterOptions}
            onPageChange={setPage}
          />
        </div>
      </PageContainer>
    </BillsTableActions>
  );
};

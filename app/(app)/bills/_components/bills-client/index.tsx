"use client";

import { FilterX, Receipt } from "lucide-react";
import { parseAsString, useQueryStates } from "nuqs";

import { Button } from "@/components/ui/button";
import { EmptyStateCard } from "@/components/empty-state-card";
import { PageContainer } from "@/components/page-container";
import { PageMeta } from "@/components/page-meta";
import { useServerListParams } from "@/lib/hooks/use-server-list-params";
import { TBillsListResult } from "@/lib/db/access/bills";
import { FilterBar } from "./filter-bar";
import { BillsTable } from "./bills-table";
import { BillsMobile } from "./bills-mobile";
import { BillsTableActions } from "./context";
import { formatUAH } from "@/lib/format/currency";
import { useTranslations } from "next-intl";
import { TSelectableEntity } from "@/components/select-input/types";
import { AddButton } from "@/components/add-button";
import { ROUTES } from "@/lib/routes";

type TProps = {
  billsList: TBillsListResult;
  properties: TSelectableEntity[];
};

export const BillsClient = ({ billsList, properties }: TProps) => {
  const { data, pagination, totals } = billsList;
  const t = useTranslations("bills.list");
  const meta = [t("meta.records", { count: pagination.total }), formatUAH(Number(totals.amount))];

  const { sorting, onSortingChange, setPage, setPageSize } = useServerListParams({
    defaultSortBy: "periodMonth",
  });

  // Read filter state to distinguish "no bills yet" from "no matching bills".
  const [filterParams, setFilterParams] = useQueryStates(
    {
      propertyId: parseAsString,
      service: parseAsString,
      dateFrom: parseAsString,
      dateTo: parseAsString,
    },
    { history: "replace", shallow: false },
  );
  const anyFilter = Boolean(
    filterParams.propertyId || filterParams.service || filterParams.dateFrom || filterParams.dateTo,
  );

  const handleClearFilters = () =>
    void setFilterParams({ propertyId: null, service: null, dateFrom: null, dateTo: null });

  return (
    <BillsTableActions>
      <PageContainer
        title="Bills"
        meta={<PageMeta items={meta} />}
        actions={<AddButton href={`${ROUTES.bills}/new`} text="Add Bill" />}
      >
        {/* Desktop layout */}
        <div className="hidden md:block">
          {(data.length > 0 || anyFilter) && <FilterBar propertyOptions={properties} />}

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
              totalAmount={totals.amount}
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
            totalAmount={totals.amount}
            propertyOptions={properties}
            onPageChange={setPage}
          />
        </div>
      </PageContainer>
    </BillsTableActions>
  );
};

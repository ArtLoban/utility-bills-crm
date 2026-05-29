"use client";

import { FilterX, Receipt } from "lucide-react";
import { useMemo } from "react";
import { parseAsString, useQueryStates } from "nuqs";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { EmptyStateCard } from "@/components/empty-state-card";
import { PageContainer } from "@/components/page-container";
import { PageMeta } from "@/components/page-meta";
import { AddButton } from "@/components/add-button";
import { getServiceLabel } from "@/lib/constants/service-colors";
import { useServerListParams } from "@/lib/hooks/use-server-list-params";
import type { PropertyId } from "@/lib/db/schema/properties";
import type { TServiceOption } from "@/lib/db/access/payments";
import type { TPaymentGlobalRow } from "@/features/payments/types";
import type { TServerPagination } from "@/lib/types/data-table";
import { ROUTES } from "@/lib/routes";
import { FilterBar } from "./filter-bar";
import { PaymentsTable } from "./payments-table";
import { PaymentsMobile } from "./payments-mobile";
import { PaymentsTableActions } from "./payments-table/context";

type TProps = {
  data: TPaymentGlobalRow[];
  pagination: TServerPagination;
  totalAmount: string;
  serviceOptions: Record<PropertyId, TServiceOption[]>;
  propertyOptions: { id: PropertyId; name: string }[];
};

export const PaymentsClient = ({
  data,
  pagination,
  totalAmount,
  serviceOptions,
  propertyOptions,
}: TProps) => {
  const t = useTranslations("payments.list");
  const { sorting, onSortingChange, setPage, setPageSize } = useServerListParams({
    defaultSortBy: "paidAt",
  });

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
    void setFilterParams({ propertyId: null, service: null, dateFrom: null, dateTo: null });

  return (
    <PaymentsTableActions>
      <PageContainer
        title={t("title")}
        meta={<PageMeta items={[`${pagination.total} records`]} />}
        actions={<AddButton href={`${ROUTES.payments}/new`} text={t("cta.addPayment")} />}
      >
        {/* Desktop layout */}
        <div className="hidden md:block">
          {(data.length > 0 || anyFilter) && (
            <FilterBar propertyOptions={propertyOptions} serviceOptions={serviceFilterOptions} />
          )}

          {data.length === 0 && !anyFilter && (
            <EmptyStateCard
              icon={Receipt}
              title="No payments yet"
              body="Record your first payment to start tracking expenses."
            />
          )}

          {data.length === 0 && anyFilter && (
            <EmptyStateCard
              icon={FilterX}
              title="No payments match your filters"
              body="Try adjusting the date range, property, or service filters."
              cta={
                <Button variant="outline" className="h-9" onClick={handleClearFilters}>
                  Clear filters
                </Button>
              }
            />
          )}

          {data.length > 0 && (
            <PaymentsTable
              data={data}
              pagination={pagination}
              totalAmount={totalAmount}
              sorting={sorting}
              onSortingChange={onSortingChange}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
            />
          )}
        </div>

        {/* Mobile layout */}
        <div className="-mx-8 md:hidden">
          <PaymentsMobile
            data={data}
            pagination={pagination}
            totalAmount={totalAmount}
            propertyOptions={propertyOptions}
            serviceOptions={serviceFilterOptions}
            onPageChange={setPage}
          />
        </div>
      </PageContainer>
    </PaymentsTableActions>
  );
};

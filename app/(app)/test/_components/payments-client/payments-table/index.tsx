"use client";

import { useTranslations } from "next-intl";

import { TPayment } from "@/app/(app)/payments/_data/mock";

import { DataTable } from "@/components/feature/data-table/data-table";
import { getPaymentsColumns } from "./utils/get-table-columns";
import { FiltersBar } from "./components/filters-bar";
import { useQueryStates } from "nuqs";
import { URL_FIELDS } from "@/app/(app)/test/_components/payments-client/payments-table/constants";
import { FiltersFormField } from "@/app/(app)/test/_components/payments-client/payments-table/types";
import { useDataTableFilters } from "@/components/feature/data-table/data-table/hooks/use-data-table-filters";
import { FooterMeta } from "@/app/(app)/test/_components/payments-client/payments-table/components/footer-meta";
import { EmptyStateCard } from "@/components/feature/data-table/data-table/components/empty-state-card";
import { hasOnlyEmptyValues } from "@/lib/utils/isEmpty";

type TProps = {
  data: TPayment[];
  filteredData: TPayment[];
  setFilteredData: (data: TPayment[]) => void;
};

export const PaymentsTable = ({ data, filteredData, setFilteredData }: TProps) => {
  const [query] = useQueryStates(URL_FIELDS);
  const t = useTranslations("payments.list");
  const columns = getPaymentsColumns(t);
  const columnFilters = useDataTableFilters(query);

  const hasRecords = data.length > 0;
  const hasFilteredRecords = filteredData.length > 0;
  const hasActiveFilters = !hasOnlyEmptyValues(query);

  return (
    <>
      <div className="hidden md:block">
        <FiltersBar />
        {!hasRecords && <EmptyStateCard />}
        {hasRecords && !hasFilteredRecords && hasActiveFilters && (
          <EmptyStateCard kind="noResults" />
        )}
        {hasRecords && (hasFilteredRecords || !hasActiveFilters) && (
          <DataTable
            data={data}
            columns={columns}
            columnFilters={columnFilters}
            // emptyState={<PaymentsEmptyState />}
            // filteredEmptyState={<PaymentsFilteredEmptyState />}
            // isFiltered={isFiltered}
            defaultSorting={{ sortBy: FiltersFormField.PAID_AT }}
            footerMeta={<FooterMeta filteredData={filteredData} />}
            onRowsChange={setFilteredData}
          />
        )}
      </div>
    </>
  );
};

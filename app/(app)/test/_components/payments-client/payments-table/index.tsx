"use client";

import { useTranslations } from "next-intl";

import { TPayment } from "@/app/(app)/payments/_data/mock";

import { DataTable } from "@/components/feature/data-table/data-table";
import { getPaymentsColumns } from "./utils/get-table-columns";
import { TableFilters } from "@/components/feature/data-table/table-filters";
import { FiltersBar } from "./components/filters-bar";
import { useQueryStates } from "nuqs";
import { URL_FIELDS } from "@/app/(app)/test/_components/payments-client/payments-table/constants";
import { useMemo } from "react";
import { ColumnFiltersState } from "@tanstack/react-table";
import { FiltersFormField } from "@/app/(app)/test/_components/payments-client/payments-table/types";
import { SortOrder } from "@/components/feature/data-table/data-table/types";
import { useDataTableFilters } from "@/components/feature/data-table/data-table/hooks/use-data-table-filters";

type TProps = {
  data: TPayment[];
};

export const PaymentsTable = ({ data }: TProps) => {
  const [query] = useQueryStates(URL_FIELDS);
  const t = useTranslations("payments.list");
  const columns = getPaymentsColumns(t);
  const columnFilters = useDataTableFilters(query);

  return (
    <>
      <FiltersBar />
      <DataTable
        data={data}
        columns={columns}
        columnFilters={columnFilters}
        // emptyState={<PaymentsEmptyState />}
        // filteredEmptyState={<PaymentsFilteredEmptyState />}
        // isFiltered={isFiltered}
        defaultSorting={{ sortBy: FiltersFormField.PAID_AT }}
        footerMeta={"TODO footerMeta"}
      />
    </>
  );
};

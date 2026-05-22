"use client";

import { useTranslations } from "next-intl";
import { useQueryStates } from "nuqs";

import { TPayment } from "@/app/(app)/payments/_data/mock";
import { DataTable } from "@/components/data-table/data-table";
import { useDataTableFilters } from "@/components/data-table/data-table/hooks/use-data-table-filters";

import { URL_FIELDS } from "./constants";
import { FiltersFormField } from "./types";
import { getPaymentsColumns } from "./utils/get-table-columns";
import { FiltersBar } from "./components/filters-bar";
import { FooterMeta } from "./components/footer-meta";
import { PaymentsTableActions } from "./context";

type TProps = {
  data: TPayment[];
  filteredData: TPayment[] | null;
  setFilteredData: (data: TPayment[]) => void;
};

export const PaymentsTable = ({ data, filteredData, setFilteredData }: TProps) => {
  const [query] = useQueryStates(URL_FIELDS);
  const t = useTranslations("payments.list");

  const columns = getPaymentsColumns(t);
  const columnFilters = useDataTableFilters(query);

  return (
    <div className="hidden md:block">
      <FiltersBar />
      <PaymentsTableActions>
        <DataTable
          data={data}
          columns={columns}
          columnFilters={columnFilters}
          defaultSorting={{ sortBy: FiltersFormField.PAID_AT }}
          footerMeta={<FooterMeta filteredData={filteredData ?? undefined} />}
          onRowsChange={setFilteredData}
        />
      </PaymentsTableActions>
    </div>
  );
};

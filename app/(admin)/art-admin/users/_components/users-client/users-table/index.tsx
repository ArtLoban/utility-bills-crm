"use client";

import { useQueryStates } from "nuqs";

import { DataTable } from "@/components/data-table/data-table";
import { useDataTableFilters } from "@/components/data-table/data-table/hooks/use-data-table-filters";

import { TAdminUser } from "../../../_data/mock";
import { URL_FIELDS } from "./constants";
import { getUserColumns } from "./utils/get-user-columns";
import { FiltersBar } from "./components/filters-bar";
import { FooterMeta } from "./components/footer-meta";

type TProps = {
  data: TAdminUser[];
  filteredData: TAdminUser[] | null;
  setFilteredData: (data: TAdminUser[]) => void;
};

export const UsersTable = ({ data, filteredData, setFilteredData }: TProps) => {
  const [query] = useQueryStates(URL_FIELDS);
  const columns = getUserColumns();
  const columnFilters = useDataTableFilters(query);

  return (
    <div className="hidden md:block">
      <FiltersBar />
      <DataTable
        data={data}
        columns={columns}
        columnFilters={columnFilters}
        defaultSorting={{ sortBy: "lastLoginSort" }}
        footerMeta={<FooterMeta filteredData={filteredData ?? undefined} />}
        onRowsChange={setFilteredData}
      />
    </div>
  );
};

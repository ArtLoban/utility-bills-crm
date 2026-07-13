"use client";

import { useTranslations } from "next-intl";
import { TBillsListResult } from "@/lib/db/access/bills";
import { getBillsColumns } from "./utils/get-table-columns";
import { FooterMeta } from "./components/footer-meta";
import { TListParams } from "@/components/data-table/types";
import { ServerTableGroup } from "@/components/data-table/server-table-group";
import { TQueryFilters } from "@/app/(secure)/(app)/bills/_components/bills-client/components/bills-table/types";
import { FilterBar } from "./components/filter-bar";

type TProps = {
  billsList: TBillsListResult;
  listParams: TListParams;
  queryFilters: TQueryFilters;
};

export const BillsTableDesktop = (props: TProps) => {
  const { billsList, listParams, queryFilters } = props;
  const { data, pagination, totals } = billsList;
  const { hasActiveFilters } = queryFilters;

  const t = useTranslations("bills.list");
  const tCommon = useTranslations("common");
  const columns = getBillsColumns(t, tCommon("notes.title"));

  return (
    <div>
      <FilterBar queryFilters={queryFilters} />
      <ServerTableGroup
        data={data}
        columns={columns}
        pagination={pagination}
        listParams={listParams}
        footerMeta={<FooterMeta totalAmount={totals.amount} />}
        hasActiveFilters={hasActiveFilters}
      />
    </div>
  );
};

"use client";

import type { TBillsListResult } from "@/lib/db/access/bills";
import { BillCard } from "./components/bill-card";
import type { TListParams } from "@/components/data-table/types";
import type { TQueryFilters } from "@/app/(app)/bills/_components/bills-client/components/bills-table/types";
import { ToolsPanel } from "./components/tools-panel";
import { MobilePager } from "@/components/data-table/components/mobile-pager";
import { MobileTotals } from "@/components/data-table/components/mobile-totals";

type TProps = {
  billsList: TBillsListResult;
  listParams: TListParams;
  queryFilters: TQueryFilters;
};

export const BillsTableMobile = (props: TProps) => {
  const { billsList, listParams, queryFilters } = props;
  const { data, pagination, totals } = billsList;

  return (
    <div className="pt-5 pb-8">
      <ToolsPanel queryFilters={queryFilters} listParams={listParams} />

      <div className="flex flex-col gap-2">
        {data.map((row) => (
          <BillCard key={row.bill.id} row={row} />
        ))}
      </div>

      <MobilePager pagination={pagination} listParams={listParams} />
      <MobileTotals title="Total" amount={totals.amount} />
    </div>
  );
};

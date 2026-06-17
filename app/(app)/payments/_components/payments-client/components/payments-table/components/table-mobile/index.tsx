"use client";

import type { TPaymentsListResult } from "@/features/payments/types";
import type { TListParams } from "@/components/data-table/types";
import type { TQueryFilters } from "../../types";
import { PaymentCard } from "./components/payment-card";
import { ToolsPanel } from "./components/tools-panel";
import { MobilePager } from "@/components/data-table/components/mobile-pager";
import { MobileTotals, MOBILE_TOTALS_TONE } from "@/components/data-table/components/mobile-totals";
import { EmptyState } from "@/components/data-table/components/empty-state";
import { resolveEmptyKind } from "@/components/data-table/utils/resolve-empty-kind";

type TProps = {
  paymentsList: TPaymentsListResult;
  listParams: TListParams;
  queryFilters: TQueryFilters;
};

export const PaymentsTableMobile = (props: TProps) => {
  const { paymentsList, listParams, queryFilters } = props;
  const { data, pagination, totals } = paymentsList;

  return (
    <div className="pt-2 pb-8">
      <ToolsPanel queryFilters={queryFilters} listParams={listParams} />

      {data.length === 0 ? (
        <EmptyState kind={resolveEmptyKind(queryFilters.hasActiveFilters)} />
      ) : (
        <>
          <div className="flex flex-col gap-2">
            {data.map((payment) => (
              <PaymentCard key={payment.payment.id} payment={payment} />
            ))}
          </div>

          <MobilePager pagination={pagination} listParams={listParams} />
          <MobileTotals amount={totals.amount} tone={MOBILE_TOTALS_TONE.POSITIVE} />
        </>
      )}
    </div>
  );
};

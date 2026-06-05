"use client";

import { useTranslations } from "next-intl";

import { formatUAH } from "@/lib/format/currency";
import type { TPaymentsListResult } from "@/features/payments/types";

import { MobilePager } from "./components/mobile-pager";
import { PaymentCard } from "./components/payment-card";
import { TListParams } from "@/components/data-table/types";

import type { TQueryFilters } from "../../types";
import { ToolsPanel } from "@/app/(app)/payments/_components/payments-client/components/payments-table/components/table-mobile/components/tools-panel";

type TProps = {
  paymentsList: TPaymentsListResult;
  listParams: TListParams;
  queryFilters: TQueryFilters;
};

export const PaymentsTableMobile = (props: TProps) => {
  const { paymentsList, listParams, queryFilters } = props;
  const { data, pagination, totals } = paymentsList;
  const t = useTranslations("payments.list");
  const { setPage } = listParams;

  return (
    <div className="pt-5 pb-8">
      <ToolsPanel queryFilters={queryFilters} />
      <div className="flex flex-col gap-2">
        {data.map((payment) => (
          <PaymentCard key={payment.payment.id} payment={payment} />
        ))}
      </div>
      {pagination.totalPages > 1 && (
        <MobilePager
          page={pagination.page}
          totalPages={pagination.totalPages}
          onPrev={() => setPage(pagination.page - 1)}
          onNext={() => setPage(pagination.page + 1)}
        />
      )}
      <div className="mt-4 flex items-center justify-between rounded-lg border border-zinc-200 bg-white p-3.5 dark:border-zinc-800 dark:bg-zinc-900">
        <span className="text-muted-foreground text-sm">{t("footer.totalPaid")}</span>
        <span className="text-[15px] font-bold text-green-600 tabular-nums dark:text-green-500">
          {formatUAH(Number(totals.amount))}
        </span>
      </div>
    </div>
  );
};

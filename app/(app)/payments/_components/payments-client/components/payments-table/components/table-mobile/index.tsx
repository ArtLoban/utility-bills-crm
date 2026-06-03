"use client";

import { useState } from "react";
import { ArrowDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { parseAsString, useQueryStates } from "nuqs";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SERVICE_COLORS } from "@/lib/constants/service-colors";
import { formatUAH } from "@/lib/format/currency";
import type { TPaymentsListResult } from "@/features/payments/types";

import { FilterChip } from "./components/filter-chip";
import { FilterSheet } from "./components/filter-sheet";
import { MobilePager } from "./components/mobile-pager";
import { PaymentCard } from "./components/payment-card";
import { TListParams } from "@/components/data-table/types";

import type { TQueryFilters } from "../../types";
import { usePaymentsTable } from "@/app/(app)/payments/_components/payments-client/context";

type TProps = {
  paymentsList: TPaymentsListResult;
  listParams: TListParams;
  queryFilters: TQueryFilters;
};

export const PaymentsTableMobile = (props: TProps) => {
  const { paymentsList, listParams, queryFilters } = props;
  const { data, pagination, totals } = paymentsList;
  const { properties } = usePaymentsTable();
  const t = useTranslations("payments.list");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [query, setQuery] = useQueryStates(
    {
      propertyId: parseAsString,
      services: parseAsString,
      dateFrom: parseAsString,
      dateTo: parseAsString,
    },
    { history: "replace", shallow: false },
  );

  const { setPage } = listParams;

  const propertyLabel = query.propertyId
    ? (properties.find((p) => p.id === query.propertyId)?.name ?? null)
    : null;
  // const serviceLabel = query.services
  //   ? (serviceOptions.find((s) => s.id === query.services)?.name ?? null)
  //   : null;
  const serviceColor = query.services
    ? SERVICE_COLORS[query.services as keyof typeof SERVICE_COLORS]
    : undefined;

  const activeCount = [query.propertyId, query.services, query.dateFrom, query.dateTo].filter(
    Boolean,
  ).length;

  const { hasActiveFilters } = queryFilters;

  return (
    <div className="px-3.5 pt-5 pb-8">
      <div
        className={cn("flex items-center justify-between", hasActiveFilters ? "mb-2.5" : "mb-3.5")}
      >
        <Button variant={activeCount > 0 ? "active" : "outline"} onClick={() => setSheetOpen(true)}>
          {t("mobile.filters")}
          {activeCount > 0 && (
            <span className="bg-brand inline-flex min-w-4 items-center justify-center rounded-full px-1 text-[10.5px] font-bold text-white">
              {activeCount}
            </span>
          )}
        </Button>

        <span className="text-muted-foreground flex items-center gap-1 text-xs">
          <ArrowDown size={13} />
          {t("mobile.sortDefault")}
        </span>
      </div>

      {activeCount > 0 && (
        <div className="mb-3.5 flex flex-wrap gap-1.5">
          {propertyLabel && (
            <FilterChip
              label={propertyLabel}
              onRemove={() => void setQuery({ propertyId: null })}
            />
          )}
          {query.services && (
            <FilterChip
              label={query.services}
              color={serviceColor}
              onRemove={() => void setQuery({ services: null })}
            />
          )}
          {query.dateFrom && (
            <FilterChip
              label={`From ${query.dateFrom}`}
              onRemove={() => void setQuery({ dateFrom: null })}
            />
          )}
          {query.dateTo && (
            <FilterChip
              label={`To ${query.dateTo}`}
              onRemove={() => void setQuery({ dateTo: null })}
            />
          )}
        </div>
      )}

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

      <FilterSheet open={sheetOpen} onOpenChange={setSheetOpen} />
    </div>
  );
};

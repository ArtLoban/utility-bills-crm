"use client";

import { useTranslations } from "next-intl";

import { EmptyState } from "@/components/data-table/components/empty-state";
import { MobilePager } from "@/components/data-table/components/mobile-pager";
import { MobileTotals, MOBILE_TOTALS_TONE } from "@/components/data-table/components/mobile-totals";
import { FilterTrigger } from "@/components/data-table/mobile/filter-trigger";
import { SortControls } from "@/components/data-table/mobile/sort/sort-controls";
import { MobileToolsPanel } from "@/components/data-table/mobile/tools-panel";
import { resolveEmptyKind } from "@/components/data-table/utils/resolve-empty-kind";
import type { TListParams } from "@/components/data-table/types";
import type { TPaymentsListResult } from "@/features/payments/types";

import type { TQueryFilters } from "../../types";
import { DEFAULT_SORT_DESC, DEFAULT_SORT_ID, SORT_FIELDS } from "./constants";
import { ActiveFilterChips } from "./components/active-filter-chips";
import { FilterFields } from "./components/filter-fields";
import { PaymentCard } from "./components/payment-card";

type TProps = {
  paymentsList: TPaymentsListResult;
  listParams: TListParams;
  queryFilters: TQueryFilters;
};

export const PaymentsTableMobile = ({ paymentsList, listParams, queryFilters }: TProps) => {
  const { data, pagination, totals } = paymentsList;
  const { values, hasActiveFilters, handleClear } = queryFilters;
  const t = useTranslations("payments.list");

  const activeCount = [
    values.propertyId != null,
    values.services != null,
    values.dateFrom != null || values.dateTo != null,
  ].filter(Boolean).length;

  return (
    <div className="pt-2 pb-8">
      <MobileToolsPanel
        filter={
          <FilterTrigger
            label={t("filters.label")}
            title={t("filters.label")}
            clearLabel={t("filters.clear")}
            activeCount={activeCount}
            onClear={handleClear}
          >
            <FilterFields queryFilters={queryFilters} />
          </FilterTrigger>
        }
        sort={
          <SortControls
            listParams={listParams}
            sortFields={SORT_FIELDS}
            defaultSort={{ id: DEFAULT_SORT_ID, desc: DEFAULT_SORT_DESC }}
            title={t("sort.title")}
            getTriggerLabel={(id, desc) => t(`sort.${id}.${desc ? "triggerDesc" : "triggerAsc"}`)}
            getOptionLabel={(id) => t(`sort.${id}.label`)}
            getDirLabel={(id, desc) => t(`sort.${id}.${desc ? "desc" : "asc"}`)}
          />
        }
        chips={<ActiveFilterChips queryFilters={queryFilters} />}
      />

      {data.length === 0 ? (
        <EmptyState kind={resolveEmptyKind(hasActiveFilters)} />
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

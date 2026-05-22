"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowDown, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useQueryStates } from "nuqs";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SERVICE_COLORS } from "@/lib/constants/service-colors";
import { formatUAH } from "@/lib/format/currency";
import { TPayment, PAYMENT_PROPERTIES, PAYMENT_SERVICES } from "@/app/(app)/payments/_data/mock";

import { FilterChip } from "./filter-chip";
import { FilterSheet } from "./filter-sheet";
import { MobilePager } from "./mobile-pager";
import { PaymentCard } from "./payment-card";
import { applyMobileFilters } from "./utils/filter-payments";
import { URL_FIELDS } from "../payments-table/constants";

const PAGE_SIZE = 20;

const PERIOD_LABELS: Record<string, string> = {
  last3: "Last 3 months",
  last6: "Last 6 months",
  last12: "Last 12 months",
};

type TProps = {
  payments: TPayment[];
};

export const PaymentsMobile = ({ payments }: TProps) => {
  const t = useTranslations("payments.list");
  const [query, setQuery] = useQueryStates(URL_FIELDS);
  const [page, setPage] = useState(1);
  const [sheetOpen, setSheetOpen] = useState(false);

  const filtered = useMemo(() => applyMobileFilters(payments, query), [payments, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const total = filtered.reduce((sum, r) => sum + r.amount, 0);

  const activeCount = [query.property, query.service, query.paidAt].filter(Boolean).length;

  const propertyLabel = query.property
    ? (PAYMENT_PROPERTIES.find((p) => p.id === query.property)?.name ?? null)
    : null;
  const serviceLabel = query.service
    ? (PAYMENT_SERVICES.find((s) => s.id === query.service)?.name ?? null)
    : null;
  const serviceColor = query.service
    ? SERVICE_COLORS[query.service as keyof typeof SERVICE_COLORS]
    : undefined;
  const periodLabel = query.paidAt ? (PERIOD_LABELS[query.paidAt] ?? null) : null;

  return (
    <div className="px-3.5 pt-5 pb-8">
      <div className="mb-3.5 flex items-start justify-between">
        <div>
          <h2 className="text-[22px] font-bold tracking-tight">{t("title")}</h2>
          <p className="text-muted-foreground mt-0.5 text-xs">{filtered.length}</p>
        </div>
        <Button asChild>
          <Link href="/test/new">
            <Plus size={14} />
            {t("mobile.add")}
          </Link>
        </Button>
      </div>

      <div
        className={cn("flex items-center justify-between", activeCount > 0 ? "mb-2.5" : "mb-3.5")}
      >
        <button
          onClick={() => setSheetOpen(true)}
          className={cn(
            "inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-md border px-3 text-[13px] font-medium",
            activeCount === 0
              ? "border-zinc-200 bg-white text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
              : "border-brand bg-brand-bg text-brand",
          )}
        >
          {t("mobile.filters")}
          {activeCount > 0 && (
            <span className="bg-brand inline-flex min-w-4 items-center justify-center rounded-full px-1 text-[10.5px] font-bold text-white">
              {activeCount}
            </span>
          )}
        </button>

        <span className="text-muted-foreground flex items-center gap-1 text-xs">
          <ArrowDown size={13} />
          {t("mobile.sortDefault")}
        </span>
      </div>

      {activeCount > 0 && (
        <div className="mb-3.5 flex flex-wrap gap-1.5">
          {propertyLabel && (
            <FilterChip label={propertyLabel} onRemove={() => void setQuery({ property: null })} />
          )}
          {serviceLabel && (
            <FilterChip
              label={serviceLabel}
              color={serviceColor}
              onRemove={() => void setQuery({ service: null })}
            />
          )}
          {periodLabel && (
            <FilterChip label={periodLabel} onRemove={() => void setQuery({ paidAt: null })} />
          )}
        </div>
      )}

      <div className="flex flex-col gap-2">
        {pageRows.map((payment) => (
          <PaymentCard key={payment.id} payment={payment} />
        ))}
      </div>

      {totalPages > 1 && (
        <MobilePager
          page={currentPage}
          totalPages={totalPages}
          onPrev={() => setPage((p) => p - 1)}
          onNext={() => setPage((p) => p + 1)}
        />
      )}

      <div className="mt-4 flex items-center justify-between rounded-lg border border-zinc-200 bg-white p-3.5 dark:border-zinc-800 dark:bg-zinc-900">
        <span className="text-muted-foreground text-sm">{t("footer.totalPaid")}</span>
        <span className="text-[15px] font-bold text-green-600 tabular-nums dark:text-green-500">
          {formatUAH(total)}
        </span>
      </div>

      <FilterSheet open={sheetOpen} onOpenChange={setSheetOpen} />
    </div>
  );
};

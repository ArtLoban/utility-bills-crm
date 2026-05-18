"use client";

// TODO(mobile): UI_ARCHITECTURE.md requires card-list collapse on mobile with bottom sheet filters.
// Not implemented in this task — the existing /payments page has a full mobile implementation
// that should be ported in a follow-up once this route replaces the old one.

import { FilterX, Plus, Wallet } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import {
  ALL_PAYMENTS,
  PAYMENT_PROPERTIES,
  PAYMENT_SERVICES,
  TPayment,
} from "@/app/(app)/payments/_data/mock";
import { Button } from "@/components/ui/button";
import { EmptyStateCard } from "@/components/empty-state-card";
import { PageContainer } from "@/components/page-container";
import { PageMeta } from "@/components/page-meta";
import { RecordPaymentModal } from "@/components/record-payment-modal";

import { formatUAH } from "@/lib/format/currency";

import { usePaymentsFilters } from "./hooks/use-payments-filters";
import { PaymentsFilters } from "./payments-filters";
import { PaymentsTable } from "./payments-table";

const PERIOD_OPTIONS = [
  { value: "last3", label: "filters.periodLast3" as const },
  { value: "last6", label: "filters.periodLast6" as const },
] as const;

const filterByPeriod = (rows: TPayment[], period: string | null): TPayment[] => {
  if (period === "last6") return rows.filter((r) => r.sortTs >= 20241001);
  if (period === "last3") return rows.filter((r) => r.sortTs >= 20250101);
  return rows;
};

export const PaymentsClientNew = () => {
  const t = useTranslations("payments.list");
  const { state, clearFilters, hasActiveFilters } = usePaymentsFilters();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<TPayment | undefined>(undefined);

  const filteredRows = useMemo(() => {
    let rows = [...ALL_PAYMENTS];
    if (state.property) rows = rows.filter((r) => r.property.id === state.property);
    if (state.service) rows = rows.filter((r) => r.service.id === state.service);
    rows = filterByPeriod(rows, state.period);
    return rows;
  }, [state.property, state.service, state.period]);

  const filteredTotal = useMemo(
    () => filteredRows.reduce((sum, r) => sum + r.amount, 0),
    [filteredRows],
  );

  const openCreate = () => {
    setEditingPayment(undefined);
    setModalOpen(true);
  };

  const openEdit = (payment: TPayment) => {
    setEditingPayment(payment);
    setModalOpen(true);
  };

  const periodOptions = PERIOD_OPTIONS.map((p) => ({ value: p.value, label: t(p.label) }));

  return (
    <PageContainer
      title={t("title")}
      meta={
        filteredRows.length > 0 ? (
          <PageMeta
            items={[t("meta.records", { count: filteredRows.length }), formatUAH(filteredTotal)]}
          />
        ) : undefined
      }
      actions={
        <Button onClick={openCreate}>
          <Plus size={14} />
          {t("cta.recordPayment")}
        </Button>
      }
    >
      <div className="hidden md:block">
        {(filteredRows.length > 0 || hasActiveFilters) && (
          <PaymentsFilters
            properties={PAYMENT_PROPERTIES}
            services={PAYMENT_SERVICES}
            periods={periodOptions}
          />
        )}

        {filteredRows.length === 0 && !hasActiveFilters && (
          <EmptyStateCard
            icon={<Wallet size={36} strokeWidth={1.5} className="text-muted-foreground/60" />}
            title={t("empty.noPayments.title")}
            body={t("empty.noPayments.body")}
            cta={
              <Button onClick={openCreate}>
                <Plus size={14} />
                {t("empty.noPayments.cta")}
              </Button>
            }
          />
        )}

        {filteredRows.length === 0 && hasActiveFilters && (
          <EmptyStateCard
            icon={<FilterX size={36} strokeWidth={1.5} className="text-muted-foreground/60" />}
            title={t("empty.filtered.title")}
            body=""
            cta={
              <Button variant="outline" onClick={clearFilters}>
                {t("empty.filtered.cta")}
              </Button>
            }
          />
        )}

        {filteredRows.length > 0 && <PaymentsTable rows={filteredRows} onEditPayment={openEdit} />}
      </div>

      <RecordPaymentModal
        key={editingPayment?.id ?? "create"}
        open={modalOpen}
        onOpenChange={setModalOpen}
        payment={editingPayment}
        properties={PAYMENT_PROPERTIES}
        services={PAYMENT_SERVICES}
      />
    </PageContainer>
  );
};

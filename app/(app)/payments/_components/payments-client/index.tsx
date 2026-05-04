"use client";

import { FilterX, Plus, Wallet } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { EmptyStateCard } from "@/components/empty-state-card";
import { RecordPaymentModal } from "@/components/record-payment-modal";
import {
  ALL_PAYMENTS,
  PAYMENT_PROPERTIES,
  PAYMENT_SERVICES,
  TFilterState,
  TPayment,
  TSortColumn,
  TSortDir,
} from "@/app/(app)/payments/_data/mock";
import { FilterBar } from "./filter-bar";
import { PaymentsTable } from "./payments-table";
import { PaymentsFooter } from "./payments-footer";
import { PaymentsMobile } from "./payments-mobile";

const getSortValue = (payment: TPayment, col: TSortColumn): string | number => {
  switch (col) {
    case "date":
      return payment.sortTs;
    case "amount":
      return payment.amount;
    case "property":
      return payment.property.name;
    case "service":
      return payment.service.name;
  }
};

const PaymentsClient = () => {
  const t = useTranslations("payments.list");

  const [filters, setFilters] = useState<TFilterState>({
    property: "all",
    service: "all",
    period: "last12",
  });
  const [sortCol, setSortCol] = useState<TSortColumn>("date");
  const [sortDir, setSortDir] = useState<TSortDir>("desc");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(25);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<TPayment | undefined>(undefined);

  const filteredPayments = useMemo(() => {
    let rows = [...ALL_PAYMENTS];

    if (filters.property !== "all") rows = rows.filter((r) => r.property.id === filters.property);
    if (filters.service !== "all") rows = rows.filter((r) => r.service.id === filters.service);
    if (filters.period === "last6") rows = rows.filter((r) => r.sortTs >= 20241001);
    if (filters.period === "last3") rows = rows.filter((r) => r.sortTs >= 20250101);

    rows.sort((a, b) => {
      const av = getSortValue(a, sortCol);
      const bv = getSortValue(b, sortCol);
      return sortDir === "asc" ? (av > bv ? 1 : -1) : av < bv ? 1 : -1;
    });

    return rows;
  }, [filters, sortCol, sortDir]);

  const totalPages = Math.ceil(filteredPayments.length / perPage);
  const pageRows = filteredPayments.slice((page - 1) * perPage, page * perPage);
  const total = filteredPayments.reduce((sum, p) => sum + p.amount, 0);
  const anyFilter =
    filters.property !== "all" || filters.service !== "all" || filters.period !== "last12";

  const handleFilterChange = (next: TFilterState) => {
    setFilters(next);
    setPage(1);
  };

  const handleSort = (col: TSortColumn) => {
    setPage(1);
    if (col === sortCol) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortCol(col);
      setSortDir("desc");
    }
  };

  const openCreate = () => {
    setEditingPayment(undefined);
    setModalOpen(true);
  };

  const openEdit = (payment: TPayment) => {
    setEditingPayment(payment);
    setModalOpen(true);
  };

  return (
    <div style={{ maxWidth: 1360, margin: "0 auto", padding: "32px 32px 48px" }}>
      {/* Desktop header */}
      <div
        className="hidden md:flex"
        style={{
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 24,
        }}
      >
        <div>
          <h2 style={{ fontSize: 28, fontWeight: 600, letterSpacing: -0.6, margin: 0 }}>
            {t("title")}
          </h2>
          {filteredPayments.length > 0 && (
            <p className="text-zinc-500 dark:text-zinc-400" style={{ fontSize: 13, marginTop: 4 }}>
              {t("subtitle", {
                count: filteredPayments.length,
                totalPaid: `${total.toLocaleString("en-US")} UAH`,
              })}
            </p>
          )}
        </div>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            openCreate();
          }}
          style={{ height: 34, gap: 6 }}
        >
          <Plus size={14} />
          {t("cta.recordPayment")}
        </Button>
      </div>

      {/* Desktop layout */}
      <div className="hidden md:block">
        {(filteredPayments.length > 0 || anyFilter) && (
          <FilterBar filters={filters} onFilterChange={handleFilterChange} anyFilter={anyFilter} />
        )}

        {filteredPayments.length === 0 && !anyFilter && (
          <EmptyStateCard
            icon={<Wallet size={36} strokeWidth={1.5} className="text-zinc-400" />}
            title={t("empty.noPayments.title")}
            body={t("empty.noPayments.body")}
            cta={
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  openCreate();
                }}
                style={{ height: 36, gap: 6 }}
              >
                <Plus size={14} />
                {t("empty.noPayments.cta")}
              </Button>
            }
          />
        )}

        {filteredPayments.length === 0 && anyFilter && (
          <EmptyStateCard
            icon={<FilterX size={36} strokeWidth={1.5} className="text-zinc-400" />}
            title={t("empty.filtered.title")}
            body=""
            cta={
              <Button
                variant="outline"
                onClick={() =>
                  handleFilterChange({ property: "all", service: "all", period: "last12" })
                }
                style={{ height: 36 }}
              >
                {t("empty.filtered.cta")}
              </Button>
            }
          />
        )}

        {filteredPayments.length > 0 && (
          <div className="overflow-hidden rounded-lg border border-zinc-200 shadow-[0_1px_2px_0_rgba(24,24,27,0.05)] dark:border-zinc-800 dark:shadow-none">
            <PaymentsTable
              rows={pageRows}
              sortCol={sortCol}
              sortDir={sortDir}
              onSort={handleSort}
              onEditPayment={openEdit}
            />
            <PaymentsFooter
              total={total}
              page={page}
              totalPages={totalPages}
              perPage={perPage}
              onPageChange={setPage}
              onPerPageChange={(next) => {
                setPerPage(next);
                setPage(1);
              }}
            />
          </div>
        )}
      </div>

      {/* Mobile layout */}
      <div className="md:hidden" style={{ margin: "0 -32px" }}>
        <PaymentsMobile
          filteredPayments={filteredPayments}
          filters={filters}
          onFilterChange={handleFilterChange}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          total={total}
          pageRows={pageRows}
          onAddPayment={openCreate}
          onEditPayment={openEdit}
        />
      </div>

      <RecordPaymentModal
        key={editingPayment?.id ?? "create"}
        open={modalOpen}
        onOpenChange={setModalOpen}
        payment={editingPayment}
        properties={PAYMENT_PROPERTIES}
        services={PAYMENT_SERVICES}
      />
    </div>
  );
};

export { PaymentsClient };

"use client";

import { FilterX, Plus, Wallet } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { EmptyStateCard } from "@/components/empty-state-card";
import { PageContainer } from "@/components/page-container";
import { PageMeta } from "@/components/page-meta";
import { RecordPaymentModal } from "@/components/record-payment-modal";
import { PAYMENT_PROPERTIES, PAYMENT_SERVICES } from "@/app/(app)/payments/_data/mock";
import { usePaymentsList } from "./hooks/use-payments-list";
import { FilterBar } from "./filter-bar";
import { PaymentsTable } from "./payments-table";
import { PaymentsFooter } from "./payments-footer";
import { PaymentsMobile } from "./payments-mobile";

export const PaymentsClient = () => {
  const t = useTranslations("payments.list");
  const {
    filters,
    sortCol,
    sortDir,
    page,
    setPage,
    perPage,
    filteredPayments,
    totalPages,
    pageRows,
    total,
    anyFilter,
    modalOpen,
    setModalOpen,
    editingPayment,
    handleFilterChange,
    handleSort,
    handlePerPageChange,
    openCreate,
    openEdit,
  } = usePaymentsList();

  return (
    <PageContainer
      title={t("title")}
      meta={
        filteredPayments.length > 0 ? (
          <PageMeta
            items={[
              t("meta.records", { count: filteredPayments.length }),
              `${total.toLocaleString("en-US")} UAH`,
            ]}
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
              <Button onClick={openCreate}>
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
              onPerPageChange={handlePerPageChange}
            />
          </div>
        )}
      </div>

      {/* Mobile layout */}
      <div className="-mx-8 md:hidden">
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
    </PageContainer>
  );
};

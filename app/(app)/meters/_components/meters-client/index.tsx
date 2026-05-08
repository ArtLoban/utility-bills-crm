"use client";

import { FilterX, Gauge } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

import { EmptyStateCard } from "@/components/empty-state-card";
import { PageContainer } from "@/components/page-container";
import { PageMeta } from "@/components/page-meta";
import { ReadingModal } from "@/components/reading-modal";
import type { TMeter } from "@/components/reading-modal/types";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";
import type { TGlobalMeter } from "../../_data/mock";
import { useMetersList } from "./hooks/use-meters-list";
import { FilterBar } from "./filter-bar";
import { MetersTable } from "./meters-table";
import { MetersFooter } from "./meters-footer";
import { MetersMobile } from "./meters-mobile";

const toReadingMeter = (meter: TGlobalMeter): TMeter => ({
  serialNumber: meter.serial,
  serviceKey: meter.serviceKey,
  propertyName: meter.property.name,
  zones: Math.min(meter.zones, 2) as 1 | 2,
  lastReadingValue: meter.lastReading?.values[0] ?? 0,
  lastReadingDate: meter.lastReading?.date ?? "",
  unit: meter.unit ?? "",
  lastReadingT1: meter.lastReading?.values[0],
  lastReadingT2: meter.lastReading?.values[1],
});

export const MetersClient = () => {
  const t = useTranslations("meters.list");
  const router = useRouter();

  const {
    filters,
    filteredMeters,
    anyFilter,
    showHistoricalBadge,
    page,
    setPage,
    perPage,
    totalPages,
    pageRows,
    propertyCount,
    activeCount,
    handleFilterChange,
    handleClearFilters,
    handlePerPageChange,
  } = useMetersList();

  const [readingMeter, setReadingMeter] = useState<TMeter | null>(null);

  return (
    <PageContainer
      title={t("title")}
      meta={
        filteredMeters.length > 0 ? (
          <PageMeta
            items={[
              t("subtitle", { count: filteredMeters.length, propertyCount }),
              t("subtitleActive", { activeCount }),
            ]}
          />
        ) : undefined
      }
    >
      {/* Desktop layout */}
      <div className="hidden md:block">
        {(filteredMeters.length > 0 || anyFilter) && (
          <FilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
            anyFilter={anyFilter}
            onClear={handleClearFilters}
          />
        )}

        {filteredMeters.length === 0 && !anyFilter && (
          <EmptyStateCard
            icon={<Gauge size={36} strokeWidth={1.5} className="text-zinc-400" />}
            title={t("empty.noMeters.title")}
            body={t("empty.noMeters.body")}
            cta={
              <Button variant="outline" onClick={() => router.push(ROUTES.properties)}>
                {t("empty.noMeters.cta")}
              </Button>
            }
          />
        )}

        {filteredMeters.length === 0 && anyFilter && (
          <EmptyStateCard
            icon={<FilterX size={36} strokeWidth={1.5} className="text-zinc-400" />}
            title={t("empty.filtered.title")}
            body=""
            cta={
              <Button variant="outline" onClick={handleClearFilters}>
                {t("empty.filtered.cta")}
              </Button>
            }
          />
        )}

        {filteredMeters.length > 0 && (
          <div className="overflow-hidden rounded-lg border border-zinc-200 shadow-[0_1px_2px_0_rgba(24,24,27,0.05)] dark:border-zinc-800 dark:shadow-none">
            <MetersTable
              rows={pageRows}
              showHistoricalBadge={showHistoricalBadge}
              onSubmitReading={(m) => setReadingMeter(toReadingMeter(m))}
            />
            <MetersFooter
              total={filteredMeters.length}
              propertyCount={propertyCount}
              activeCount={activeCount}
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
        <MetersMobile
          filteredMeters={filteredMeters}
          filters={filters}
          onFilterChange={handleFilterChange}
          onClear={handleClearFilters}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          pageRows={pageRows}
          onSubmitReading={(m) => setReadingMeter(toReadingMeter(m))}
        />
      </div>

      {readingMeter && (
        <ReadingModal
          open
          onOpenChange={(open) => {
            if (!open) setReadingMeter(null);
          }}
          meter={readingMeter}
        />
      )}
    </PageContainer>
  );
};

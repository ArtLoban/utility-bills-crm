"use client";

import { FilterX, Gauge } from "lucide-react";
import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

import { EmptyStateCard } from "@/components/empty-state-card";
import { PageContainer } from "@/components/page-container";
import { PageMeta } from "@/components/page-meta";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";
import type { TMeterGlobalRow } from "@/lib/db/access/meters";
import { useMetersList } from "./hooks/use-meters-list";
import { FilterBar } from "./filter-bar";
import { MetersTable } from "./meters-table";
import { MetersFooter } from "./meters-footer";
import { MetersMobile } from "./meters-mobile";

type TPropertyOption = { id: string; name: string };

type TProps = {
  meters: TMeterGlobalRow[];
  properties: TPropertyOption[];
};

export const MetersClient = ({ meters, properties }: TProps) => {
  const t = useTranslations("meters.list");
  const router = useRouter();

  const serviceTypes = useMemo(() => {
    const seen = new Set<string>();
    const result: { code: string }[] = [];
    for (const row of meters) {
      if (!seen.has(row.serviceType.code)) {
        seen.add(row.serviceType.code);
        result.push({ code: row.serviceType.code });
      }
    }
    return result;
  }, [meters]);

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
  } = useMetersList(meters);

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
            properties={properties}
            serviceTypes={serviceTypes}
            onFilterChange={handleFilterChange}
            anyFilter={anyFilter}
            onClear={handleClearFilters}
          />
        )}

        {filteredMeters.length === 0 && !anyFilter && (
          <EmptyStateCard
            icon={Gauge}
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
            icon={FilterX}
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
            <MetersTable rows={pageRows} showHistoricalBadge={showHistoricalBadge} />
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
          properties={properties}
          serviceTypes={serviceTypes}
        />
      </div>
    </PageContainer>
  );
};

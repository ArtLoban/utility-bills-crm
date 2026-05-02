"use client";

import { FilterX, Gauge } from "lucide-react";
import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { EmptyStateCard } from "@/components/empty-state-card";
import { ReadingModal } from "@/components/reading-modal";
import type { TMeter } from "@/components/reading-modal/types";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";
import {
  ALL_METERS,
  SERVICE_ORDER,
  type TFilterState,
  type TGlobalMeter,
  type TMeterStatus,
} from "../../_data/mock";
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

const MetersClient = () => {
  const t = useTranslations("meters.list");
  const pathname = usePathname();
  const router = useRouter();
  const sp = useSearchParams();

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(25);
  const [readingMeter, setReadingMeter] = useState<TMeter | null>(null);

  const filters: TFilterState = {
    property: sp.get("property") ?? "all",
    service: sp.get("service") ?? "all",
    status: (sp.get("status") ?? "active") as TMeterStatus,
  };

  const updateFilter = (key: keyof TFilterState, value: string) => {
    const params = new URLSearchParams(sp.toString());
    const defaults: Record<keyof TFilterState, string> = {
      property: "all",
      service: "all",
      status: "active",
    };
    if (value === defaults[key]) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    setPage(1);
    const qs = params.toString();
    router.push(pathname + (qs ? `?${qs}` : ""));
  };

  const clearFilters = () => {
    setPage(1);
    router.push(pathname);
  };

  const anyFilter =
    filters.property !== "all" || filters.service !== "all" || filters.status !== "active";

  const filteredMeters = useMemo(() => {
    let rows = [...ALL_METERS];

    if (filters.status === "active") rows = rows.filter((m) => m.removedAt === null);
    else if (filters.status === "historical") rows = rows.filter((m) => m.removedAt !== null);

    if (filters.property !== "all") rows = rows.filter((m) => m.property.id === filters.property);
    if (filters.service !== "all") rows = rows.filter((m) => m.serviceKey === filters.service);

    rows.sort((a, b) => {
      const propCmp = a.property.name.localeCompare(b.property.name);
      if (propCmp !== 0) return propCmp;
      const svcCmp = (SERVICE_ORDER[a.serviceKey] ?? 99) - (SERVICE_ORDER[b.serviceKey] ?? 99);
      if (svcCmp !== 0) return svcCmp;
      return b.installedAtMs - a.installedAtMs;
    });

    return rows;
  }, [filters.property, filters.service, filters.status]);

  const totalPages = Math.ceil(filteredMeters.length / perPage);
  const pageRows = filteredMeters.slice((page - 1) * perPage, page * perPage);

  const propertyCount = useMemo(
    () => new Set(filteredMeters.map((m) => m.property.id)).size,
    [filteredMeters],
  );

  const activeCount = useMemo(
    () => filteredMeters.filter((m) => m.removedAt === null).length,
    [filteredMeters],
  );

  const showHistoricalBadge = filters.status === "all";

  return (
    <div style={{ maxWidth: 1360, margin: "0 auto", padding: "32px 32px 48px" }}>
      {/* Desktop header */}
      <div className="hidden md:flex" style={{ alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 28, fontWeight: 600, letterSpacing: -0.6, margin: 0 }}>
            {t("title")}
          </h2>
          {filteredMeters.length > 0 && (
            <p className="text-zinc-500 dark:text-zinc-400" style={{ fontSize: 13, marginTop: 4 }}>
              {t("subtitle", { count: filteredMeters.length, propertyCount })}
              {" · "}
              {t("subtitleActive", { activeCount })}
            </p>
          )}
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden md:block">
        {(filteredMeters.length > 0 || anyFilter) && (
          <FilterBar
            filters={filters}
            onFilterChange={updateFilter}
            anyFilter={anyFilter}
            onClear={clearFilters}
          />
        )}

        {filteredMeters.length === 0 && !anyFilter && (
          <EmptyStateCard
            icon={<Gauge size={36} strokeWidth={1.5} className="text-zinc-400" />}
            title={t("empty.noMeters.title")}
            body={t("empty.noMeters.body")}
            cta={
              <Button
                variant="outline"
                onClick={() => router.push(ROUTES.properties)}
                style={{ height: 36 }}
              >
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
              <Button variant="outline" onClick={clearFilters} style={{ height: 36 }}>
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
        <MetersMobile
          filteredMeters={filteredMeters}
          filters={filters}
          onFilterChange={updateFilter}
          onClear={clearFilters}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          pageRows={pageRows}
          onSubmitReading={(m) => setReadingMeter(toReadingMeter(m))}
        />
      </div>

      {readingMeter && (
        <ReadingModal
          open={readingMeter !== null}
          onOpenChange={(open) => {
            if (!open) setReadingMeter(null);
          }}
          meter={readingMeter}
        />
      )}
    </div>
  );
};

export { MetersClient };

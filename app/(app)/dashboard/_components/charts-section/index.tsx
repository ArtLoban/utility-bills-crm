"use client";

import type { ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { parseAsString, parseAsStringLiteral, useQueryStates } from "nuqs";

import { formatMonthYearLong, isoToYearMonth } from "@/lib/format/date";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQueryFilters } from "@/lib/hooks/use-query-filters";
import { resolveServiceTypeLabel } from "@/features/services/service-label";
import type { TServiceTypeCode } from "@/features/services/service-type";
import type { TMonthlyExpensesAggregate } from "@/features/ledger";
import type { TAvailableConsumptionService } from "@/features/meters";
import { CHART_MODES, DASHBOARD_CHART_PARAMS } from "../../_data/query-params";
import { buildChartSeries } from "./series";
import { FilterBar } from "./components/filter-bar";
import { INITIAL_FILTERS, URL_FIELDS } from "./constants";
import { ExpensePieChart } from "./expense-pie-chart";
import { LineChartCard } from "./line-chart-card";
import { MonthlyBarChart } from "./monthly-bar-chart";
import { TrendLineChart } from "./trend-line-chart";

type TPropertyOption = {
  id: string;
  name: string;
};

type TProps = {
  aggregate: TMonthlyExpensesAggregate;
  properties: TPropertyOption[];
  resolvedDateFrom: string;
  resolvedDateTo: string;
  serviceTypeCodes: TServiceTypeCode[];
  availableConsumptionServices: TAvailableConsumptionService[];
  // Server-resolved default (first available service or URL param) — used to initialise picker
  consumptionServiceCode: string | null;
  // Pre-rendered Suspense slot from page.tsx; null in money mode
  consumptionLineChartSlot: ReactNode;
};

export const ChartsSection = ({
  aggregate,
  properties,
  resolvedDateFrom,
  resolvedDateTo,
  serviceTypeCodes,
  availableConsumptionServices,
  consumptionServiceCode,
  consumptionLineChartSlot,
}: TProps) => {
  // Filter bar state (date / property / service). syncPage:false — no pagination here.
  // useQueryFilters writes with shallow:false, so changing a filter re-runs the page's
  // server queries and recomputes the aggregate (unlike the previous shallow writes).
  const queryFilters = useQueryFilters(URL_FIELDS, INITIAL_FILTERS, { syncPage: false });

  // Chart-mode toggle and consumption-service picker share one query state, separate from
  // the filter bar. Both write with shallow:false: switching to consumption (or changing
  // the service) must re-render page.tsx so it builds the consumption slot on demand and
  // runs the per-service query — money-only views never pay for it.
  const [chartState, setChartState] = useQueryStates(
    {
      [DASHBOARD_CHART_PARAMS.CHART_MODE]: parseAsStringLiteral(CHART_MODES),
      [DASHBOARD_CHART_PARAMS.CONSUMPTION_SERVICE]: parseAsString,
    },
    { shallow: false },
  );

  const t = useTranslations("dashboard.charts");
  const tServiceTypes = useTranslations("services.types");
  const locale = useLocale();

  const isConsumptionMode = chartState.chartMode === "consumption";
  const hasConsumptionData = availableConsumptionServices.length > 0;

  const getServiceLabel = (code: string): string =>
    resolveServiceTypeLabel(code as TServiceTypeCode, tServiceTypes);

  const periodLabel = `${formatMonthYearLong(isoToYearMonth(resolvedDateFrom), locale)} – ${formatMonthYearLong(isoToYearMonth(resolvedDateTo), locale)}`;

  // Chart series: regular types stay merged by concept, custom `other` split per service.
  const series = buildChartSeries(aggregate, tServiceTypes);

  const serviceOptions = serviceTypeCodes.map((code) => ({
    id: code,
    name: getServiceLabel(code),
  }));

  const effectiveServiceCode = chartState.consumptionService ?? consumptionServiceCode;
  const effectiveService = availableConsumptionServices.find(
    (s) => s.code === effectiveServiceCode,
  );
  const lineChartSubtitle =
    isConsumptionMode && effectiveService
      ? `${getServiceLabel(effectiveService.code)}, ${effectiveService.unit.toUpperCase()}`
      : `${t("service.all")}, ₴`;

  // null fallback covers the RSC transition window: isConsumptionMode flips on the client
  // immediately when the URL updates, but consumptionLineChartSlot stays null until the
  // server re-render completes. Show a skeleton instead of an empty card body.
  const consumptionContent = !hasConsumptionData ? (
    <div className="flex h-80 items-center justify-center">
      <p className="text-muted-foreground text-sm">{t("consumption.noServices")}</p>
    </div>
  ) : (
    (consumptionLineChartSlot ?? <div className="bg-muted h-80 animate-pulse rounded-lg" />)
  );

  const servicePickerSlot =
    isConsumptionMode && availableConsumptionServices.length > 1 ? (
      <Select
        value={chartState.consumptionService ?? consumptionServiceCode ?? undefined}
        onValueChange={(value) => void setChartState({ consumptionService: value })}
      >
        <SelectTrigger size="sm" className="text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent align="end">
          {availableConsumptionServices.map((s) => (
            <SelectItem key={s.code} value={s.code}>
              {getServiceLabel(s.code)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    ) : null;

  return (
    <div className="flex flex-col gap-4">
      {/* Mobile section header */}
      <div className="flex items-center justify-between md:hidden">
        <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
          {t("title")}
        </span>
        <span className="text-muted-foreground text-xs">{periodLabel}</span>
      </div>

      {/* Filter bar — desktop TODO: Implement for mobile! */}
      <div className="-mb-3.5 hidden md:block">
        <FilterBar
          queryFilters={queryFilters}
          properties={properties}
          serviceOptions={serviceOptions}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1.4fr]">
        <ExpensePieChart
          aggregate={aggregate}
          series={series}
          dateFrom={resolvedDateFrom}
          dateTo={resolvedDateTo}
          title={t("pie.title")}
          subtitle={periodLabel}
        />
        <MonthlyBarChart
          aggregate={aggregate}
          series={series}
          title={t("bar.title")}
          subtitle={t("bar.subtitle")}
        />
      </div>

      <LineChartCard
        title={t("line.title")}
        subtitle={lineChartSubtitle}
        isConsumptionMode={isConsumptionMode}
        onMoneyMode={() => void setChartState({ chartMode: null })}
        onConsumptionMode={() => void setChartState({ chartMode: "consumption" })}
        moneyModeLabel={t("line.mode.expenses")}
        consumptionModeLabel={t("line.mode.consumption")}
        hasConsumptionData={hasConsumptionData}
        servicePickerSlot={servicePickerSlot}
        moneySlot={<TrendLineChart aggregate={aggregate} series={series} />}
        consumptionSlot={consumptionContent}
      />
    </div>
  );
};

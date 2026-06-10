"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { parseAsString, parseAsStringLiteral, useQueryStates } from "nuqs";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQueryFilters } from "@/lib/hooks/use-query-filters";
import type { TMonthlyExpensesAggregate } from "@/features/ledger";
import type { TAvailableConsumptionService } from "@/features/meters";
import { CHART_MODES, DASHBOARD_CHART_PARAMS } from "../../_data/query-params";
import { FilterBar } from "./components/filter-bar";
import { INITIAL_FILTERS, URL_FIELDS } from "./constants";
import { ExpensePieChart } from "./expense-pie-chart";
import { LineChartCard } from "./line-chart-card";
import { MonthlyBarChart } from "./monthly-bar-chart";
import { TrendLineChart } from "./trend-line-chart";
import { formatMonthLong } from "./utils";

type TPropertyOption = { id: string; name: string };

type TProps = {
  aggregate: TMonthlyExpensesAggregate;
  properties: TPropertyOption[];
  resolvedDateFrom: string;
  resolvedDateTo: string;
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

  const isConsumptionMode = chartState.chartMode === "consumption";
  const hasConsumptionData = availableConsumptionServices.length > 0;

  const getServiceLabel = (code: string): string =>
    tServiceTypes(code as Parameters<typeof tServiceTypes>[0]);

  const periodLabel = `${formatMonthLong(resolvedDateFrom)} – ${formatMonthLong(resolvedDateTo)}`;

  const serviceOptions = aggregate.services.map((s) => ({
    id: s.code,
    name: getServiceLabel(s.code),
  }));

  const effectiveServiceCode = chartState.consumptionService ?? consumptionServiceCode;
  const effectiveService = availableConsumptionServices.find(
    (s) => s.code === effectiveServiceCode,
  );
  const lineChartSubtitle =
    isConsumptionMode && effectiveService
      ? `${getServiceLabel(effectiveService.code)}, ${effectiveService.unit.toUpperCase()}`
      : `${t("service.all")}, UAH`;

  // null fallback covers the RSC transition window: isConsumptionMode flips on the client
  // immediately when the URL updates, but consumptionLineChartSlot stays null until the
  // server re-render completes. Show a skeleton instead of an empty card body.
  const consumptionContent = !hasConsumptionData ? (
    <div className="flex h-[320px] items-center justify-center">
      <p className="text-sm text-zinc-400 dark:text-zinc-600">{t("consumption.noServices")}</p>
    </div>
  ) : (
    (consumptionLineChartSlot ?? (
      <div className="h-[320px] animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-800" />
    ))
  );

  const servicePickerSlot =
    isConsumptionMode && availableConsumptionServices.length > 1 ? (
      <Select
        value={chartState.consumptionService ?? consumptionServiceCode ?? undefined}
        onValueChange={(value) => void setChartState({ consumptionService: value })}
      >
        <SelectTrigger size="sm" className="text-[12.5px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent align="end">
          {availableConsumptionServices.map((s) => (
            <SelectItem key={s.code} value={s.code}>
              {tServiceTypes(s.code as Parameters<typeof tServiceTypes>[0])}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    ) : null;

  return (
    <div className="flex flex-col gap-4">
      {/* Mobile section header */}
      <div className="flex items-center justify-between md:hidden">
        <span className="text-muted-foreground text-[11.5px] font-semibold tracking-[0.6px] uppercase">
          {t("title")}
        </span>
        <span className="text-muted-foreground text-xs">{periodLabel}</span>
      </div>

      {/* Filter bar — desktop */}
      <div className="hidden md:block">
        <FilterBar
          queryFilters={queryFilters}
          properties={properties}
          serviceOptions={serviceOptions}
        />
      </div>

      {/* Top row: Pie + Bar */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_1.4fr]">
        <ExpensePieChart
          aggregate={aggregate}
          dateFrom={resolvedDateFrom}
          dateTo={resolvedDateTo}
          title={t("pie.title")}
          subtitle={periodLabel}
          getServiceLabel={getServiceLabel}
        />
        <MonthlyBarChart
          aggregate={aggregate}
          title={t("bar.title")}
          subtitle={t("bar.subtitle")}
          getServiceLabel={getServiceLabel}
        />
      </div>

      {/* Bottom row: Line chart card with in-card header and mode toggle */}
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
        moneySlot={<TrendLineChart aggregate={aggregate} getServiceLabel={getServiceLabel} />}
        consumptionSlot={consumptionContent}
      />
    </div>
  );
};

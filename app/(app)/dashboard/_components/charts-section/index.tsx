"use client";

import { useTranslations } from "next-intl";
import { useQueryStates } from "nuqs";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { TMonthlyExpensesAggregate } from "@/features/ledger";
import { dashboardChartSearchParams } from "../../_data/query-params";
import { ExpensePieChart } from "./expense-pie-chart";
import { MonthlyBarChart } from "./monthly-bar-chart";
import { TrendLineChart } from "./trend-line-chart";
import { formatMonthLong } from "./utils";

type TPropertyOption = { id: string; name: string };

type TProps = {
  aggregate: TMonthlyExpensesAggregate;
  properties: TPropertyOption[];
  resolvedDateFrom: string;
  resolvedDateTo: string;
};

type TPeriodPreset = { key: "3m" | "6m" | "12m" | "24m"; months: number };

const PERIOD_PRESETS: TPeriodPreset[] = [
  { key: "3m", months: 3 },
  { key: "6m", months: 6 },
  { key: "12m", months: 12 },
  { key: "24m", months: 24 },
];

const resolvePeriodPresetDates = (months: number): { dateFrom: string; dateTo: string } => {
  const now = new Date();
  const dateTo = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const dateFrom = new Date(dateTo);
  dateFrom.setUTCMonth(dateFrom.getUTCMonth() - (months - 1));
  return {
    dateFrom: dateFrom.toISOString().slice(0, 10),
    dateTo: dateTo.toISOString().slice(0, 10),
  };
};

export const ChartsSection = ({
  aggregate,
  properties,
  resolvedDateFrom,
  resolvedDateTo,
}: TProps) => {
  const [params, setParams] = useQueryStates(dashboardChartSearchParams);
  const t = useTranslations("dashboard.charts");
  const tServiceTypes = useTranslations("services.types");

  const getServiceLabel = (code: string): string =>
    tServiceTypes(code as Parameters<typeof tServiceTypes>[0]);

  const activePreset =
    PERIOD_PRESETS.find(({ months }) => {
      const preset = resolvePeriodPresetDates(months);
      return resolvedDateFrom === preset.dateFrom && resolvedDateTo === preset.dateTo;
    }) ?? null;

  const periodLabel = `${formatMonthLong(resolvedDateFrom)} – ${formatMonthLong(resolvedDateTo)}`;

  const serviceOptions = aggregate.services.map((s) => ({
    code: s.code,
    label: getServiceLabel(s.code),
  }));

  const selectedServices = params.services;
  const servicesLabel =
    !selectedServices || selectedServices.length === 0
      ? t("service.all")
      : selectedServices.length === 1
        ? getServiceLabel(selectedServices[0]!)
        : t("service.selected", { count: selectedServices.length });

  const toggleService = (code: string) => {
    if (!selectedServices || selectedServices.length === 0) {
      void setParams({
        services: serviceOptions.filter((s) => s.code !== code).map((s) => s.code),
      });
    } else {
      const next = selectedServices.includes(code)
        ? selectedServices.filter((c) => c !== code)
        : [...selectedServices, code];
      void setParams({
        services: next.length === 0 || next.length === serviceOptions.length ? null : next,
      });
    }
  };

  const isServiceChecked = (code: string): boolean =>
    !selectedServices || selectedServices.length === 0 || selectedServices.includes(code);

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
      <div className="hidden items-center gap-2 rounded-[8px] border bg-white px-3 py-2.5 shadow transition-shadow duration-150 hover:shadow-md md:flex dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none dark:hover:shadow-none">
        <span className="pr-1 pl-1 text-[12.5px] text-zinc-500">{t("period.label")}</span>

        {/* Period presets */}
        <div className="flex items-center gap-1">
          {PERIOD_PRESETS.map((preset) => {
            const isActive = activePreset?.key === preset.key;
            return (
              <button
                key={preset.key}
                type="button"
                onClick={() => {
                  const dates = resolvePeriodPresetDates(preset.months);
                  void setParams({ dateFrom: dates.dateFrom, dateTo: dates.dateTo });
                }}
                className="cursor-pointer rounded px-3 py-[5px] text-[12.5px] transition-colors"
                style={{
                  fontWeight: isActive ? 500 : 400,
                  background: isActive ? "var(--background)" : "transparent",
                  color: isActive ? "var(--foreground)" : "var(--muted-foreground)",
                  boxShadow: isActive ? "0 1px 2px rgba(0,0,0,0.05)" : "none",
                  border: isActive ? "1px solid var(--border)" : "1px solid transparent",
                }}
              >
                {t(`period.last${preset.key}` as Parameters<typeof t>[0])}
              </button>
            );
          })}
        </div>

        <div className="mx-1 h-5 w-px bg-zinc-200 dark:bg-zinc-700" />

        {/* Property filter */}
        {properties.length > 1 && (
          <select
            value={params.propertyId ?? ""}
            onChange={(e) => void setParams({ propertyId: e.target.value || null })}
            className="cursor-pointer rounded-[6px] border px-2 text-[12.5px] dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
            style={{ height: 32 }}
          >
            <option value="">{t("property.all")}</option>
            {properties.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        )}

        {/* Services multi-select */}
        {serviceOptions.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex h-8 cursor-pointer items-center gap-1.5 rounded-[6px] border px-2 text-[12.5px] transition-colors dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
              >
                <span className="text-zinc-500 dark:text-zinc-400">{t("service.label")}:</span>
                <span className="text-zinc-800 dark:text-zinc-100">{servicesLabel}</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {serviceOptions.map((opt) => (
                <DropdownMenuCheckboxItem
                  key={opt.code}
                  checked={isServiceChecked(opt.code)}
                  onCheckedChange={() => toggleService(opt.code)}
                >
                  {opt.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <div className="flex-1" />
        <span className="text-[12px] text-zinc-500">{periodLabel}</span>
      </div>

      {/* Top row: Pie + Bar */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_1.4fr]">
        <ExpensePieChart
          aggregate={aggregate}
          dateFrom={resolvedDateFrom}
          dateTo={resolvedDateTo}
          getServiceLabel={getServiceLabel}
        />
        <MonthlyBarChart
          aggregate={aggregate}
          dateFrom={resolvedDateFrom}
          dateTo={resolvedDateTo}
          getServiceLabel={getServiceLabel}
        />
      </div>

      {/* Bottom row: Line */}
      <TrendLineChart aggregate={aggregate} getServiceLabel={getServiceLabel} />
    </div>
  );
};

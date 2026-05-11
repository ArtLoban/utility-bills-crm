"use client";

import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import { ACCENT, TINT_BG, TINT_BORDER } from "@/lib/constants/ui-tokens";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";

import { usePaymentsFilters } from "./hooks/use-payments-filters";

type TPropertyOption = { id: string; name: string };
type TServiceOption = { id: string; name: string };
type TPeriodOption = { value: string; label: string };

type TProps = {
  properties: TPropertyOption[];
  services: TServiceOption[];
  periods: TPeriodOption[];
};

// Extracted as a constant — same violet tint tokens used by FilterBar in /payments
const ACTIVE_TRIGGER_STYLE = {
  border: `1px solid ${TINT_BORDER}`,
  background: TINT_BG,
  color: ACCENT,
  fontWeight: 500,
} as const;

const PaymentsFilters = ({ properties, services, periods }: TProps) => {
  const t = useTranslations("payments.list.filters");
  const { state, setState, clearFilters, hasActiveFilters } = usePaymentsFilters();

  // Base UI unmounts popup items when closed, so Select.Value can't resolve the label
  // from ItemText. Derive display labels directly from the props arrays instead.
  const propertyLabel = properties.find((p) => p.id === state.property)?.name;
  const serviceLabel = services.find((s) => s.id === state.service)?.name;
  const periodLabel = periods.find((p) => p.value === state.period)?.label;

  return (
    <div className="border-border bg-background mb-4 flex flex-wrap items-center gap-[10px] rounded-lg border px-[14px] py-[10px]">
      <span className="text-muted-foreground pl-0.5 text-xs">{t("label")}</span>

      <Select
        value={state.property ?? undefined}
        onValueChange={(v) => setState({ property: v === "__all__" ? null : v })}
      >
        <SelectTrigger
          className={cn("min-w-[140px] rounded-md", state.property && "[&_svg]:text-inherit")}
          style={state.property ? ACTIVE_TRIGGER_STYLE : undefined}
        >
          <span className={cn("flex flex-1 text-left", !state.property && "text-muted-foreground")}>
            {propertyLabel ?? t("property")}
          </span>
        </SelectTrigger>
        <SelectContent align="start">
          <SelectItem value="__all__">{t("allProperties")}</SelectItem>
          {properties.map((p) => (
            <SelectItem key={p.id} value={p.id}>
              {p.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={state.service ?? undefined}
        onValueChange={(v) => setState({ service: v === "__all__" ? null : v })}
      >
        <SelectTrigger
          className={cn("min-w-[140px] rounded-md", state.service && "[&_svg]:text-inherit")}
          style={state.service ? ACTIVE_TRIGGER_STYLE : undefined}
        >
          <span className={cn("flex flex-1 text-left", !state.service && "text-muted-foreground")}>
            {serviceLabel ?? t("service")}
          </span>
        </SelectTrigger>
        <SelectContent align="start">
          <SelectItem value="__all__">{t("allServices")}</SelectItem>
          {services.map((s) => (
            <SelectItem key={s.id} value={s.id}>
              {s.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={state.period ?? undefined}
        onValueChange={(v) => setState({ period: v === "__all__" ? null : v })}
      >
        <SelectTrigger
          className={cn("min-w-[140px] rounded-md", state.period && "[&_svg]:text-inherit")}
          style={state.period ? ACTIVE_TRIGGER_STYLE : undefined}
        >
          <span className={cn("flex flex-1 text-left", !state.period && "text-muted-foreground")}>
            {periodLabel ?? t("period")}
          </span>
        </SelectTrigger>
        <SelectContent align="start">
          <SelectItem value="__all__">{t("allPeriods")}</SelectItem>
          {periods.map((p) => (
            <SelectItem key={p.value} value={p.value}>
              {p.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="text-muted-foreground cursor-pointer text-xs underline"
          style={{ background: "none", border: "none", padding: 0, fontFamily: "inherit" }}
        >
          {t("clear")}
        </button>
      )}
    </div>
  );
};

export { PaymentsFilters };

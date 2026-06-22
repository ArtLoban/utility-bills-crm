import { Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { PageShell } from "@/components/page-shell";
import { requireSession } from "@/lib/auth/guards";
import type { UserId } from "@/lib/db/schema/auth";
import { accessibleProperties } from "@/lib/db/access/properties";
import { serviceIdsForUser } from "@/lib/db/access/services";
import {
  balancesForProperties,
  balancesForServices,
  monthlyExpensesByService,
} from "@/features/ledger";
import { availableConsumptionServiceTypes } from "@/features/meters";
import { missingCurrentMonthReadings } from "./_data/reads";
import { loadDashboardChartParams } from "./_data/query-params";
import { resolveDefaultDateRange } from "./_data/chart-transforms";
import type { TAttentionData, TBalanceData } from "./_data/types";
import { AttentionBlock } from "./_components/attention-block";
import { BalanceBlock } from "./_components/balance-block";
import { ChartsSection } from "./_components/charts-section";
import { DashboardEmptyState } from "./_components/dashboard-empty-state";
import { ConsumptionLineChartServer } from "./_components/charts-section/consumption-line-chart";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Overview of your properties, balances, and recent activity.",
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const user = await requireSession();
  const userId = user.id as UserId;
  const firstName = user.name?.split(" ")[0] ?? null;

  const chartParams = await loadDashboardChartParams(searchParams);
  const defaultRange = resolveDefaultDateRange();
  const resolvedDateFrom = chartParams.dateFrom ?? defaultRange.dateFrom;
  const resolvedDateTo = chartParams.dateTo ?? defaultRange.dateTo;

  // Round 1: parallel — all queries need only userId (plus resolved date range for charts)
  const [accessible, serviceIds, missingReadings, aggregate, availableConsumptionServices] =
    await Promise.all([
      accessibleProperties(userId),
      serviceIdsForUser(userId),
      missingCurrentMonthReadings(userId),
      monthlyExpensesByService(userId, {
        dateFrom: resolvedDateFrom,
        dateTo: resolvedDateTo,
        propertyId: chartParams.propertyId,
        serviceTypeCodes: chartParams.services ? [chartParams.services] : null,
      }),
      availableConsumptionServiceTypes(userId, { propertyId: chartParams.propertyId }),
    ]);

  if (accessible.length === 0) {
    return (
      <PageShell>
        <DashboardEmptyState firstName={firstName} />
      </PageShell>
    );
  }

  // Round 2: parallel — depend on round 1 results
  const propertyIds = accessible.map((a) => a.property.id);
  const [propertyBalances, serviceBalances] = await Promise.all([
    balancesForProperties(userId, propertyIds),
    balancesForServices(serviceIds),
  ]);

  // Compute balance breakdown from per-service data (Decision #107: balance > 0 = debt)
  const allServiceBalances = [...serviceBalances.values()];
  const debtBalances = allServiceBalances.filter((b) => b.balance > 0);
  const overpayBalances = allServiceBalances.filter((b) => b.balance < 0);

  const balanceData: TBalanceData = {
    totalDebt: debtBalances.reduce((sum, b) => sum + b.balance, 0),
    debtServicesCount: debtBalances.length,
    totalOverpayment: overpayBalances.reduce((sum, b) => sum + Math.abs(b.balance), 0),
    overpayServicesCount: overpayBalances.length,
    // Negate per-property balance: TBalance positive=debt, but BalanceBlock negative=debt
    byProperty: accessible.map(({ property }) => ({
      id: property.id,
      name: property.name,
      type: property.type,
      balance: -(propertyBalances.get(property.id)?.balance ?? 0),
    })),
  };

  const hasDebt = balanceData.debtServicesCount > 0;
  const hasMissingReadings = missingReadings.length > 0;

  const currentMonth = new Date();
  currentMonth.setDate(1);
  currentMonth.setHours(0, 0, 0, 0);

  const attentionData: TAttentionData | null =
    hasDebt || hasMissingReadings
      ? {
          totalDebt: balanceData.totalDebt,
          debtServicesCount: balanceData.debtServicesCount,
          missingReadingsCount: missingReadings.length,
          currentMonth,
        }
      : null;

  const t = await getTranslations("dashboard");
  const properties = accessible.map(({ property }) => ({ id: property.id, name: property.name }));

  // Resolve the effective consumption service for the slot and picker.
  // consumptionService URL param is null when the user hasn't picked explicitly —
  // fall back to the first available service. The default is NOT written to the URL here;
  // only explicit user selection writes consumptionService to the URL (Decision for Stage 3).
  const consumptionServiceCode =
    chartParams.consumptionService ?? availableConsumptionServices[0]?.code ?? null;

  // Build the slot on demand: only in consumption mode, and only when a service is
  // resolvable. The chartMode toggle writes with shallow:false (see ChartsSection), so
  // switching Money→Consumption re-renders this page and runs the consumption query
  // exactly then — money-only views never pay for it.
  const consumptionLineChartSlot =
    chartParams.chartMode === "consumption" && consumptionServiceCode !== null ? (
      <Suspense
        fallback={
          <div className="h-[320px] animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-800" />
        }
      >
        <ConsumptionLineChartServer
          userId={userId}
          serviceTypeCode={consumptionServiceCode}
          dateFrom={resolvedDateFrom}
          dateTo={resolvedDateTo}
          propertyId={chartParams.propertyId}
        />
      </Suspense>
    ) : null;

  return (
    <PageShell>
      <div className="mb-5 md:mb-7">
        <h2 className="m-0 text-2xl font-semibold tracking-[-0.6px] text-zinc-950 md:text-[28px] dark:text-zinc-50">
          {firstName ? t("greeting.withName", { name: firstName }) : t("greeting.fallback")}
        </h2>
      </div>

      <div className="flex flex-col gap-3.5 md:gap-5">
        {attentionData !== null && <AttentionBlock data={attentionData} />}
        <BalanceBlock data={balanceData} />
        <ChartsSection
          aggregate={aggregate}
          properties={properties}
          resolvedDateFrom={resolvedDateFrom}
          resolvedDateTo={resolvedDateTo}
          availableConsumptionServices={availableConsumptionServices}
          consumptionServiceCode={consumptionServiceCode}
          consumptionLineChartSlot={consumptionLineChartSlot}
        />
      </div>
    </PageShell>
  );
}

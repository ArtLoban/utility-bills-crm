import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { auth } from "@/lib/auth";
import type { UserId } from "@/lib/db/schema/auth";
import { accessibleProperties } from "@/lib/db/access/properties";
import { serviceIdsForUser } from "@/lib/db/access/services";
import { balancesForProperties, balancesForServices } from "@/features/ledger";
import { MOCK_CHART_DATA } from "./_data/mock";
import { missingCurrentMonthReadings } from "./_data/reads";
import type { TAttentionData, TBalanceData } from "./_data/types";
import { AttentionBlock } from "./_components/attention-block";
import { BalanceBlock } from "./_components/balance-block";
import { ChartsSection } from "./_components/charts-section";
import { DashboardEmptyState } from "./_components/dashboard-empty-state";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Overview of your properties, balances, and recent activity.",
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const userId = session.user.id as UserId;
  const firstName = session.user.name?.split(" ")[0] ?? null;

  // Round 1: parallel — all queries need only userId
  const [accessible, serviceIds, missingReadings] = await Promise.all([
    accessibleProperties(userId),
    serviceIdsForUser(userId),
    missingCurrentMonthReadings(userId),
  ]);

  if (accessible.length === 0) {
    return (
      <div className="mx-auto w-full max-w-[1360px] px-3.5 pt-5 pb-9 md:px-8 md:pt-8 md:pb-12">
        <DashboardEmptyState firstName={firstName} />
      </div>
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

  return (
    <div className="mx-auto w-full max-w-[1360px] px-3.5 pt-5 pb-9 md:px-8 md:pt-8 md:pb-12">
      <div className="mb-5 md:mb-7">
        <h2 className="m-0 text-2xl font-semibold tracking-[-0.6px] text-zinc-950 md:text-[28px] dark:text-zinc-50">
          {firstName ? t("greeting.withName", { name: firstName }) : t("greeting.fallback")}
        </h2>
        <p className="text-muted-foreground mt-[3px] text-[13px] md:hidden">
          {MOCK_CHART_DATA.periodLabel}
        </p>
      </div>

      <div className="flex flex-col gap-3.5 md:gap-5">
        {attentionData !== null && <AttentionBlock data={attentionData} />}
        <BalanceBlock data={balanceData} />
        <ChartsSection data={MOCK_CHART_DATA} />
      </div>
    </div>
  );
}

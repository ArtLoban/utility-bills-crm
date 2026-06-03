import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Overview of your properties, balances, and recent activity.",
};
import { MOCK_DASHBOARD_DATA } from "./_data/mock";
import { AttentionBlock } from "./_components/attention-block";
import { BalanceBlock } from "./_components/balance-block";
import { ChartsSection } from "./_components/charts-section";
import { DashboardEmptyState } from "./_components/dashboard-empty-state";

const MOCK_HAS_PROPERTIES = true;

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const data = MOCK_DASHBOARD_DATA;
  const firstName = session.user.name?.split(" ")[0] ?? null;

  return (
    <div className="mx-auto w-full max-w-[1360px] px-3.5 pt-5 pb-9 md:px-8 md:pt-8 md:pb-12">
      {!MOCK_HAS_PROPERTIES ? (
        <DashboardEmptyState firstName={firstName} />
      ) : (
        <>
          <div className="mb-5 md:mb-7">
            <h2 className="m-0 text-2xl font-semibold tracking-[-0.6px] text-zinc-950 md:text-[28px] dark:text-zinc-50">
              {firstName ? `Hi, ${firstName}` : "Hello!"}
            </h2>
            <p className="text-muted-foreground mt-[3px] text-[13px] md:hidden">
              {data.charts.periodLabel}
            </p>
          </div>

          <div className="flex flex-col gap-3.5 md:gap-5">
            {data.attention !== null && <AttentionBlock data={data.attention} />}
            <BalanceBlock data={data.balance} />
            <ChartsSection data={data.charts} />
          </div>
        </>
      )}
    </div>
  );
}

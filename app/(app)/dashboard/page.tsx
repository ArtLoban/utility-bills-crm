import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { MOCK_DASHBOARD_DATA } from "./_data/mock";
import { AttentionBlock } from "./_components/attention-block";
import { BalanceBlock } from "./_components/balance-block";
import { ChartsSection } from "./_components/charts-section";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const data = MOCK_DASHBOARD_DATA;
  const firstName = session.user.name?.split(" ")[0] ?? null;

  return (
    <div
      style={{
        maxWidth: 1360,
        margin: "0 auto",
        padding: "32px 32px 48px",
        width: "100%",
      }}
    >
      <h2
        style={{
          margin: 0,
          marginBottom: 28,
          fontSize: 28,
          fontWeight: 600,
          letterSpacing: -0.6,
        }}
        className="text-zinc-950 dark:text-zinc-50"
      >
        {firstName ? `Hi, ${firstName}` : "Hello!"}
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {data.attention !== null && <AttentionBlock data={data.attention} />}
        <BalanceBlock data={data.balance} />
        <ChartsSection data={data.charts} />
      </div>
    </div>
  );
}

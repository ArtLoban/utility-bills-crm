import { MOCK_CONTRACT_HISTORY, MOCK_METER_FOR_READING, MOCK_SERVICE_DETAIL } from "./_data/mock";
import { ActivityCard } from "./_components/activity-card";
import { BalanceCard } from "./_components/balance-card";
import { ContractCard } from "./_components/contract-card";
import { MeterCard } from "./_components/meter-card";
import { NotesCard } from "./_components/notes-card";
import { QuickActions } from "./_components/quick-actions";
import { ServicePageHeader } from "./_components/service-page-header";

export default function ServicePage() {
  return (
    <div style={{ maxWidth: 1360, margin: "0 auto", padding: "28px 32px 56px", width: "100%" }}>
      <ServicePageHeader serviceDetail={MOCK_SERVICE_DETAIL} />
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <BalanceCard balance={MOCK_SERVICE_DETAIL.balance} />
        <ContractCard contract={MOCK_SERVICE_DETAIL.contract} history={MOCK_CONTRACT_HISTORY} />
        <MeterCard meter={MOCK_SERVICE_DETAIL.meter} readingMeter={MOCK_METER_FOR_READING} />
        <ActivityCard activity={MOCK_SERVICE_DETAIL.activity} />
        <NotesCard notes={MOCK_SERVICE_DETAIL.notes} />
        <QuickActions readingMeter={MOCK_METER_FOR_READING} />
      </div>
    </div>
  );
}

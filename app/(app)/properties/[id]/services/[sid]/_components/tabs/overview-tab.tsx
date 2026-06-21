import { balancesForServices } from "@/features/ledger";
import type { TBalance } from "@/features/ledger";
import type { TServiceId } from "@/lib/db/schema/services";
import { getServiceActivity } from "../../_data/queries";
import { ActivityCard } from "../activity-card";
import { BalanceCard } from "../balance-card";
import { NotesCard } from "../notes-card";

const ZERO_BALANCE: TBalance = { billsTotal: 0, paymentsTotal: 0, balance: 0 };

type TProps = {
  serviceId: TServiceId;
  notes: string | null;
};

export const OverviewTab = async ({ serviceId, notes }: TProps) => {
  const [serviceBalances, serviceActivity] = await Promise.all([
    balancesForServices([serviceId]),
    getServiceActivity(serviceId),
  ]);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 lg:grid-cols-[2fr_3fr]">
        <BalanceCard balance={serviceBalances.get(serviceId) ?? ZERO_BALANCE} />
        <NotesCard notes={notes} />
      </div>
      <ActivityCard items={serviceActivity} />
    </div>
  );
};

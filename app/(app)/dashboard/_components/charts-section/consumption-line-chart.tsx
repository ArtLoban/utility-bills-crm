import type { UserId } from "@/lib/db/schema/auth";
import { monthlyConsumptionByService } from "@/features/meters";

import { ConsumptionChart } from "./consumption-chart";

type TProps = {
  userId: UserId;
  serviceTypeCode: string;
  dateFrom: string;
  dateTo: string;
  propertyId: string | null;
};

// Async server component — runs the consumption query on-demand when the Suspense
// boundary in page.tsx resolves. In money mode this component is never rendered.
const ConsumptionLineChartServer = async ({
  userId,
  serviceTypeCode,
  dateFrom,
  dateTo,
  propertyId,
}: TProps) => {
  const aggregate = await monthlyConsumptionByService(userId, {
    serviceTypeCode,
    dateFrom,
    dateTo,
    propertyId,
  });

  return <ConsumptionChart aggregate={aggregate} />;
};

export { ConsumptionLineChartServer };

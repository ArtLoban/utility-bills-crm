import { loadReadingsParams } from "@/features/readings/query-params";
import type { TMeter } from "@/lib/db/schema/meters";
import type { TPropertyRole } from "@/lib/db/schema/properties";
import type { TServiceType } from "@/lib/db/schema/service-types";

import { getMeterReadingsList } from "../../_data/queries";
import { ReadingsSection } from "../readings-section";

type TProps = {
  meter: TMeter;
  serviceType: TServiceType;
  role: TPropertyRole;
  searchParams: Record<string, string>;
};

export const ReadingsTab = async ({ meter, serviceType, role, searchParams }: TProps) => {
  const params = await loadReadingsParams(searchParams);
  const result = await getMeterReadingsList(meter.id, params);

  const readingsList = result.ok
    ? result.value
    : { data: [], pagination: { page: 1, pageSize: params.pageSize, total: 0, totalPages: 1 } };

  const hasDateFilter = Boolean(params.dateFrom || params.dateTo);

  return (
    <ReadingsSection
      meter={meter}
      serviceType={serviceType}
      readingsList={readingsList}
      role={role}
      hasDateFilter={hasDateFilter}
    />
  );
};

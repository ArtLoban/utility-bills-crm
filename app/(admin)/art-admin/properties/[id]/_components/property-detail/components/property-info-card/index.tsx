import { DataCard } from "@/components/data-card";
import { InfoGrid } from "@/components/info-grid";
import type { TAdminPropertyDetail } from "@/features/admin-properties";

import { buildInfoRows } from "./utils/build-info-rows";

type TProps = {
  property: TAdminPropertyDetail;
};

export const PropertyInfoCard = ({ property }: TProps) => {
  const rows = buildInfoRows(property);

  return (
    <DataCard className="overflow-hidden">
      <div className="border-border border-b px-6 py-4">
        <h3 className="text-sm font-semibold">Property information</h3>
      </div>
      <div className="px-6">
        <InfoGrid rows={rows} />
      </div>
    </DataCard>
  );
};

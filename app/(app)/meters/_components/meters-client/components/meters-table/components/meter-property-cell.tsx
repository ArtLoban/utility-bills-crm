import { useTranslations } from "next-intl";

import { PropertyCell } from "@/components/data-table/cells/property-cell";
import { Badge } from "@/components/ui/badge";
import type { TMeterGlobalRow } from "@/lib/db/access/meters";

type TProps = {
  row: TMeterGlobalRow;
  showHistoricalBadge: boolean;
};

export const MeterPropertyCell = ({ row, showHistoricalBadge }: TProps) => {
  const t = useTranslations("meters.list");

  return (
    <span className="inline-flex items-center gap-2">
      <PropertyCell property={row.property} />
      {showHistoricalBadge && row.meter.validTo !== null && <Badge>{t("badge.historical")}</Badge>}
    </span>
  );
};

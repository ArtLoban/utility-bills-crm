import { getTranslations } from "next-intl/server";

import { SectionCard } from "@/components/section-card";
import { KVGrid } from "@/components/kv-grid";
import { formatDisplayDate } from "@/lib/format/date";
import type { TMeter } from "@/lib/db/schema/meters";
import type { TServiceType } from "@/lib/db/schema/service-types";
import { getServiceTypeVisuals, TServiceTypeCode } from "@/features/services/service-type";
import { resolveServiceTypeLabelServer } from "@/features/services/service-label.server";

type TProps = {
  meter: TMeter;
  serviceType: TServiceType;
  propertyName: string;
};

export const DetailsCard = async ({ meter, serviceType, propertyName }: TProps) => {
  const t = await getTranslations("meters.detail.details");

  const { color, Icon } = getServiceTypeVisuals(serviceType.code as TServiceTypeCode);
  const serviceName = await resolveServiceTypeLabelServer(serviceType);

  const zonesLabel = ((): string => {
    switch (meter.zoneCount) {
      case 1:
        return t("zoneCount.single");
      case 2:
        return t("zoneCount.two");
      case 3:
        return t("zoneCount.three");
      default:
        return t("zoneCount.other", { count: meter.zoneCount });
    }
  })();

  return (
    <SectionCard title={t("title")}>
      <div className="px-4 py-4 sm:px-5">
        <KVGrid
          pairs={[
            [
              t("serviceType"),
              <span key="serviceType" className="inline-flex items-center gap-1.5">
                <Icon size={14} style={{ color }} />
                {serviceName}
              </span>,
            ],
            [t("property"), propertyName],
            [
              t("serialNumber"),
              <span key="serial" className="font-mono">
                {meter.serialNumber ?? "—"}
              </span>,
            ],
            [t("zones"), zonesLabel],
            [t("installedAt"), formatDisplayDate(meter.installedAt)],
            [t("activeSince"), formatDisplayDate(meter.validFrom)],
          ]}
        />
      </div>
    </SectionCard>
  );
};

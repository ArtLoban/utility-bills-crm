import { getTranslations } from "next-intl/server";

import { SectionCard } from "@/components/section-card";
import { KVGrid } from "@/components/kv-grid";
import { formatDisplayDate } from "@/lib/format/date";
import type { TMeter } from "@/lib/db/schema/meters";
import type { TServiceType } from "@/lib/db/schema/service-types";
import { getServiceTypeVisuals, TServiceTypeCode } from "@/features/services/service-type";

type TProps = {
  meter: TMeter;
  serviceType: TServiceType;
  propertyName: string;
};

export const DetailsCard = async ({ meter, serviceType, propertyName }: TProps) => {
  const [t, tTypes] = await Promise.all([
    getTranslations("meters.detail.details"),
    getTranslations("services.types"),
  ]);

  const { color, Icon } = getServiceTypeVisuals(serviceType.code as TServiceTypeCode);
  const serviceName = tTypes(serviceType.code as Parameters<typeof tTypes>[0]);

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
      <div className="px-5 py-4">
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

        {meter.notes && (
          <div className="border-border mt-4 border-t pt-4">
            <p className="text-muted-foreground mb-1 text-xs font-medium tracking-wide uppercase">
              {t("notes")}
            </p>
            <p className="text-foreground text-sm leading-snug whitespace-pre-wrap">
              {meter.notes}
            </p>
          </div>
        )}
      </div>
    </SectionCard>
  );
};

import { getTranslations } from "next-intl/server";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { IconBadge } from "@/components/icon-badge";
import { PageMeta } from "@/components/page-meta";
import { ROUTES } from "@/lib/routes";
import { formatDisplayDate } from "@/lib/format/date";
import type { TMeter } from "@/lib/db/schema/meters";
import type { TServiceType } from "@/lib/db/schema/service-types";
import { getServiceTypeVisuals, TServiceTypeCode } from "@/features/services/service-type";
import { ReplaceMeterButton } from "./replace-meter-button";
import { OverflowMenu } from "./overflow-menu";

type TProps = {
  meter: TMeter;
  serviceType: TServiceType;
  propertyId: string;
  propertyName: string;
  canMutate: boolean;
};

export const MeterPageHeader = async ({
  meter,
  serviceType,
  propertyId,
  propertyName,
  canMutate,
}: TProps) => {
  const [tNav, t, tTypes] = await Promise.all([
    getTranslations("nav"),
    getTranslations("meters.detail"),
    getTranslations("services.types"),
  ]);

  const { color, Icon } = getServiceTypeVisuals(serviceType.code as TServiceTypeCode);
  const meterTitle = t("title", {
    type: tTypes(serviceType.code as Parameters<typeof tTypes>[0]),
  });
  const isHistorical = meter.validTo !== null;

  return (
    <div className="mb-5 md:mb-7">
      <Breadcrumbs
        items={[
          { label: tNav("properties"), href: ROUTES.properties },
          { label: propertyName, href: `${ROUTES.properties}/${propertyId}` },
          { label: meterTitle },
        ]}
      />

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-3 md:gap-4">
          <IconBadge icon={Icon} color={color} size="lg" border />

          <div className="min-w-0 flex-1">
            <h1 className="text-foreground flex items-center gap-3 text-2xl font-semibold tracking-[-0.6px] md:text-[28px]">
              {meterTitle}
              {isHistorical && <Badge>{t("badge.historical")}</Badge>}
            </h1>
            <PageMeta
              items={[
                <span key="zones" style={{ color }}>
                  {t("meta.zones", { count: meter.zoneCount })}
                </span>,
                meter.serialNumber ? (
                  <span key="serial" className="font-mono">
                    {t("meta.serial", { value: meter.serialNumber })}
                  </span>
                ) : null,
                meter.installedAt
                  ? t("meta.installed", { date: formatDisplayDate(meter.installedAt) })
                  : null,
              ]}
            />
          </div>
        </div>

        {canMutate && !isHistorical && (
          <div className="flex items-center justify-end gap-2">
            <ReplaceMeterButton propertyId={propertyId} meterId={meter.id} />
            <OverflowMenu propertyId={propertyId} meterId={meter.id} meterTitle={meterTitle} />
          </div>
        )}
      </div>
    </div>
  );
};

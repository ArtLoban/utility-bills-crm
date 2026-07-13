"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

import { LinkButton } from "@/components/link-button";
import { IconBadge } from "@/components/icon-badge";
import { Surface } from "@/components/surface";
import { ROUTES } from "@/lib/routes";
import type { TMeter } from "@/lib/db/schema/meters";
import type { TServiceType } from "@/lib/db/schema/service-types";
import { getServiceTypeVisuals, TServiceTypeCode } from "@/features/services/service-type";
import { resolveServiceTypeLabel } from "@/features/services/service-label";

type TProps = {
  meter: TMeter;
  serviceType: TServiceType;
  propertyId: string;
  canMutate: boolean;
};

export const MeterRow = ({ meter, serviceType, propertyId, canMutate }: TProps) => {
  const t = useTranslations("meters.propertyTab.row");
  const tDetail = useTranslations("meters.detail");
  const tTypes = useTranslations("services.types");
  const tBadge = useTranslations("meters.list.badge");
  const tZones = useTranslations("meters.list.zones");

  const { color, Icon } = getServiceTypeVisuals(serviceType.code as TServiceTypeCode);
  const isHistorical = meter.validTo !== null;
  const serviceName = resolveServiceTypeLabel(serviceType.code as TServiceTypeCode, tTypes);
  const meterHref = `${ROUTES.properties}/${propertyId}/meters/${meter.id}`;

  return (
    <Surface elevation="sm" className="flex items-center gap-3.5 px-5 py-4">
      <IconBadge icon={Icon} color={color} />

      <Link href={meterHref} className="min-w-0 flex-1 no-underline">
        <p className="text-foreground mb-0.5 text-sm font-medium">
          {tDetail("title", { type: serviceName })}
          {isHistorical && (
            <span className="text-muted-foreground ml-2 text-xs font-medium">
              {tBadge("historical")}
            </span>
          )}
        </p>
        <p className="text-muted-foreground text-xs">
          {tZones("count", { count: meter.zoneCount })}
          {meter.serialNumber && (
            <>
              <span className="text-border mx-1.5">·</span>
              <span className="font-mono">{meter.serialNumber}</span>
            </>
          )}
        </p>
      </Link>

      {canMutate && !isHistorical && (
        <LinkButton href={`${meterHref}/replace`} text={t("replace")} />
      )}
    </Surface>
  );
};

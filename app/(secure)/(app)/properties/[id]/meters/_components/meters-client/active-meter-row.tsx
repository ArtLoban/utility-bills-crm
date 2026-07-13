"use client";

import Link from "next/link";
import { Eye } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/link-button";
import { IconBadge } from "@/components/icon-badge";
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
  isLast: boolean;
};

export const ActiveMeterRow = ({ meter, serviceType, propertyId, canMutate, isLast }: TProps) => {
  const t = useTranslations("meters.propertyTab.row");
  const tDetail = useTranslations("meters.detail");
  const tTypes = useTranslations("services.types");
  const tZones = useTranslations("meters.list.zones");

  const { color, Icon } = getServiceTypeVisuals(serviceType.code as TServiceTypeCode);
  const serviceName = resolveServiceTypeLabel(serviceType.code as TServiceTypeCode, tTypes);
  const meterHref = `${ROUTES.properties}/${propertyId}/meters/${meter.id}`;

  return (
    <div
      className={`flex items-start gap-3.5 px-4 py-4.5 sm:items-center sm:px-5 ${!isLast ? "border-border border-b" : ""}`}
    >
      <IconBadge icon={Icon} color={color} />

      <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
        <div className="min-w-0">
          <p className="text-foreground mb-0.5 text-sm font-medium">
            {tDetail("title", { type: serviceName })}
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
        </div>

        <div className="flex shrink-0 items-center gap-2 self-end sm:self-auto">
          <Button asChild variant="outline" size="icon-sm">
            <Link href={meterHref}>
              <Eye />
              <span className="sr-only">{t("open")}</span>
            </Link>
          </Button>

          {canMutate && <LinkButton href={`${meterHref}/replace`} text={t("replace")} />}
        </div>
      </div>
    </div>
  );
};

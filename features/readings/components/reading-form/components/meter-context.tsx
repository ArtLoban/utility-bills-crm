"use client";

import { useTranslations } from "next-intl";

import { getServiceTypeVisuals, type TServiceTypeCode } from "@/features/services/service-type";
import { resolveServiceTypeLabel } from "@/features/services/service-label";
import type { TMeter } from "@/lib/db/schema/meters";
import type { TServiceType } from "@/lib/db/schema/service-types";

type TProps = {
  meter: TMeter;
  serviceType: TServiceType;
  propertyName: string;
};

export const MeterContext = ({ meter, serviceType, propertyName }: TProps) => {
  const t = useTranslations("readings.form.meterContext");
  const tTypes = useTranslations("services.types");
  const { color, Icon } = getServiceTypeVisuals(serviceType.code as TServiceTypeCode);

  const typeName = resolveServiceTypeLabel(serviceType.code as TServiceTypeCode, tTypes);

  return (
    <div className="bg-muted flex items-center gap-3 rounded-lg px-3.5 py-3">
      <div
        className="flex size-9 shrink-0 items-center justify-center rounded-lg"
        style={{ background: `color-mix(in srgb, ${color} 10%, transparent)` }}
      >
        <Icon size={18} strokeWidth={1.75} style={{ color }} />
      </div>
      <div className="min-w-0">
        <div className="text-foreground truncate text-sm font-semibold">
          {t("title", { type: typeName })}
          {meter.serialNumber && (
            <span className="text-muted-foreground font-normal">
              {" · "}
              {t("serial", { serial: meter.serialNumber })}
            </span>
          )}
          {meter.zoneCount > 1 && (
            <span className="text-muted-foreground font-normal">
              {" · "}
              {t("zones", { count: meter.zoneCount })}
            </span>
          )}
        </div>
        <div className="text-muted-foreground mt-0.5 text-xs">{propertyName}</div>
      </div>
    </div>
  );
};

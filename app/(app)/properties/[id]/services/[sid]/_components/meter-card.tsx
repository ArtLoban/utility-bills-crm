import type { ReactNode } from "react";
import { Gauge } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { LinkButton } from "@/components/link-button";
import { SectionCard } from "@/components/section-card";
import { SectionCardEmpty } from "@/components/section-card-empty";
import { KVGrid } from "@/components/kv-grid";
import { formatDisplayDate } from "@/lib/format/date";
import { ROUTES } from "@/lib/routes";
import {
  UNIT_LABELS,
  ZONE_COLOR_VARS,
  ZONE_SHORT_TAGS,
  zoneSummaryKey,
} from "@/lib/constants/zones";
import type { TMeter } from "@/lib/db/schema/meters";
import type { TReading } from "@/lib/db/schema/readings";
import type { TServiceType } from "@/lib/db/schema/service-types";

type TProps = {
  meter: TMeter | null;
  propertyId: string;
  serviceType: TServiceType;
  lastReading: TReading | null;
  action?: ReactNode;
};

export const MeterCard = async ({
  meter,
  propertyId,
  serviceType,
  lastReading,
  action,
}: TProps) => {
  const t = await getTranslations("services.detail.meter");
  const tZones = await getTranslations("zones");

  if (meter === null) {
    return (
      <SectionCard title={t("title")}>
        <SectionCardEmpty icon={Gauge} caption={t("empty")} />
      </SectionCard>
    );
  }

  const locale = await getLocale();
  const formatValue = (value: string) => new Intl.NumberFormat(locale).format(Number(value));
  const zonesLabel = tZones(zoneSummaryKey(meter.zoneCount) as Parameters<typeof tZones>[0]);

  const unitLabel = serviceType.unit ? UNIT_LABELS[serviceType.unit] : "";
  const readingValues = lastReading
    ? [lastReading.valueT1, lastReading.valueT2, lastReading.valueT3]
    : [];

  return (
    <SectionCard
      title={t("title")}
      description={t("subtitle")}
      actions={
        <div className="flex flex-wrap items-center justify-end gap-2">
          {action}
          <LinkButton
            href={`${ROUTES.properties}/${propertyId}/meters/${meter.id}`}
            text={t("viewDetails")}
          />
        </div>
      }
    >
      <div className="px-4 py-4 sm:px-5">
        <KVGrid
          pairs={[
            [
              t("serialNumber"),
              <span key="serial" className="font-mono">
                {meter.serialNumber ?? "—"}
              </span>,
            ],
            [t("zones"), zonesLabel],
            [t("activeSince"), formatDisplayDate(meter.validFrom)],
            [t("installedAt"), formatDisplayDate(meter.installedAt)],
          ]}
        />

        {lastReading && (
          <div className="mt-4 flex flex-col gap-2.5 md:flex-row">
            {Array.from({ length: meter.zoneCount }, (_, i) => {
              const value = readingValues[i];
              if (value == null) return null;
              const color = ZONE_COLOR_VARS[i];

              return (
                <div
                  key={i}
                  className="flex flex-1 items-center justify-between rounded-lg px-3.5 py-2.5"
                  style={{
                    background: `color-mix(in srgb, ${color} 8%, transparent)`,
                    border: `1px solid color-mix(in srgb, ${color} 25%, transparent)`,
                  }}
                >
                  <span className="text-muted-foreground text-xs font-medium">
                    {ZONE_SHORT_TAGS[i] ?? `T${i + 1}`}
                  </span>
                  <span className="text-sm font-bold tabular-nums" style={{ color }}>
                    {formatValue(value)}
                    {unitLabel && (
                      <span className="text-muted-foreground ml-1 text-xs font-normal">
                        {unitLabel}
                      </span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </SectionCard>
  );
};

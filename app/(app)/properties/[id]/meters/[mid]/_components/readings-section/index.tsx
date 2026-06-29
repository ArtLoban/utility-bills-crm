"use client";

import { Gauge, Plus } from "lucide-react";
import { useTranslations } from "next-intl";

import { LinkButton } from "@/components/link-button";
import { SectionCard } from "@/components/section-card";
import { SectionCardEmpty } from "@/components/section-card-empty";
import { PROPERTY_ROLES } from "@/lib/db/schema/properties";
import { ROUTES } from "@/lib/routes";
import type { TPropertyRole } from "@/lib/db/schema/properties";
import type { TReading } from "@/lib/db/schema/readings";
import type { TMeter } from "@/lib/db/schema/meters";
import type { TServiceType } from "@/lib/db/schema/service-types";
import { ReadingsTable } from "./readings-table";

type TProps = {
  meter: TMeter;
  serviceType: TServiceType;
  readings: TReading[];
  role: TPropertyRole;
};

export const ReadingsSection = ({ meter, serviceType, readings, role }: TProps) => {
  const t = useTranslations("meters.detail.readings");
  const canMutate = role !== PROPERTY_ROLES.VIEWER;
  const newReadingHref = `${ROUTES.properties}/${meter.propertyId}/meters/${meter.id}/reading/new`;

  return (
    <SectionCard
      title={t("title")}
      actions={
        canMutate ? (
          <LinkButton href={newReadingHref} icon={Plus} text={t("submit")} variant="default" />
        ) : undefined
      }
    >
      {readings.length === 0 ? (
        <SectionCardEmpty
          icon={Gauge}
          caption={t("empty")}
          action={
            canMutate ? (
              <LinkButton href={newReadingHref} icon={Plus} text={t("submitFirst")} />
            ) : undefined
          }
        />
      ) : (
        <ReadingsTable
          readings={readings}
          meter={meter}
          serviceType={serviceType}
          canMutate={canMutate}
        />
      )}
    </SectionCard>
  );
};

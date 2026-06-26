"use client";

import Link from "next/link";
import { Gauge, Plus } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
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
          <Button size="sm" asChild>
            <Link href={newReadingHref}>
              <Plus className="size-3.5" />
              {t("submit")}
            </Link>
          </Button>
        ) : undefined
      }
    >
      {readings.length === 0 ? (
        <SectionCardEmpty
          icon={Gauge}
          caption={t("empty")}
          action={
            canMutate ? (
              <Button variant="outline" size="sm" asChild>
                <Link href={newReadingHref}>
                  <Plus className="size-3.5" />
                  {t("submitFirst")}
                </Link>
              </Button>
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

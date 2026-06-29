"use client";

import { Gauge, Plus } from "lucide-react";
import { useTranslations } from "next-intl";

import { LinkButton } from "@/components/link-button";
import { SectionCard } from "@/components/section-card";
import { SectionCardEmpty } from "@/components/section-card-empty";
import { PROPERTY_ROLES } from "@/lib/db/schema/properties";
import { ROUTES } from "@/lib/routes";
import type { TPropertyRole } from "@/lib/db/schema/properties";
import type { TReadingsListResult } from "@/lib/db/access/readings";
import type { TMeter } from "@/lib/db/schema/meters";
import type { TServiceType } from "@/lib/db/schema/service-types";
import { ReadingsTable } from "./readings-table";

type TProps = {
  meter: TMeter;
  serviceType: TServiceType;
  readingsList: TReadingsListResult;
  role: TPropertyRole;
  hasDateFilter: boolean;
};

export const ReadingsSection = ({
  meter,
  serviceType,
  readingsList,
  role,
  hasDateFilter,
}: TProps) => {
  const t = useTranslations("meters.detail.readings");
  const canMutate = role !== PROPERTY_ROLES.VIEWER;
  const newReadingHref = `${ROUTES.properties}/${meter.propertyId}/meters/${meter.id}/reading/new`;
  const isEmpty = readingsList.pagination.total === 0 && !hasDateFilter;

  return (
    <SectionCard
      title={t("title")}
      actions={
        canMutate ? (
          <LinkButton href={newReadingHref} icon={Plus} text={t("submit")} variant="default" />
        ) : undefined
      }
    >
      {isEmpty ? (
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
        <div className="p-4">
          <ReadingsTable
            readingsList={readingsList}
            meter={meter}
            serviceType={serviceType}
            canMutate={canMutate}
          />
        </div>
      )}
    </SectionCard>
  );
};

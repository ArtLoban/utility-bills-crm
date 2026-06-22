"use client";

import { useState } from "react";
import { Gauge, Plus } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { SectionCard } from "@/components/section-card";
import { SectionCardEmpty } from "@/components/section-card-empty";
import { SubmitReadingModal } from "@/features/readings/components/submit-reading-modal";
import { PROPERTY_ROLES } from "@/lib/db/schema/properties";
import type { TPropertyRole } from "@/lib/db/schema/properties";
import type { TReading } from "@/lib/db/schema/readings";
import type { TMeter } from "@/lib/db/schema/meters";
import type { TServiceType } from "@/lib/db/schema/service-types";
import { ReadingsTable } from "./readings-table";

type TProps = {
  meter: TMeter;
  serviceType: TServiceType;
  propertyName: string;
  readings: TReading[];
  lastReading: TReading | null;
  role: TPropertyRole;
};

export const ReadingsSection = ({
  meter,
  serviceType,
  propertyName,
  readings,
  lastReading,
  role,
}: TProps) => {
  const t = useTranslations("meters.detail.readings");
  const [submitOpen, setSubmitOpen] = useState(false);
  const canMutate = role !== PROPERTY_ROLES.VIEWER;

  return (
    <>
      <SectionCard
        title={t("title")}
        actions={
          canMutate ? (
            <Button size="sm" onClick={() => setSubmitOpen(true)}>
              <Plus className="size-3.5" />
              {t("submit")}
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
                <Button variant="outline" size="sm" onClick={() => setSubmitOpen(true)}>
                  <Plus className="size-3.5" />
                  {t("submitFirst")}
                </Button>
              ) : undefined
            }
          />
        ) : (
          <ReadingsTable
            readings={readings}
            meter={meter}
            serviceType={serviceType}
            propertyName={propertyName}
            canMutate={canMutate}
          />
        )}
      </SectionCard>

      {canMutate && (
        <SubmitReadingModal
          open={submitOpen}
          onOpenChange={setSubmitOpen}
          meter={meter}
          serviceType={serviceType}
          propertyName={propertyName}
          lastReading={lastReading}
        />
      )}
    </>
  );
};

"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Gauge, Plus } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { EmptyStateCard } from "@/components/empty-state-card";
import { SectionCard } from "@/components/section-card";
import { ROUTES } from "@/lib/routes";
import { PROPERTY_ROLES, type TPropertyRole } from "@/lib/db/schema/properties";
import type { TPropertyMeterRow } from "../../_data/queries";
import { ActiveMeterRow } from "./active-meter-row";
import { MeterRow } from "./meter-row";
import { LinkButton } from "@/components/link-button";

type TProps = {
  propertyId: string;
  meters: TPropertyMeterRow[];
  role: TPropertyRole;
};

export const MetersClient = ({ propertyId, meters, role }: TProps) => {
  const t = useTranslations("meters.propertyTab");
  const [historyExpanded, setHistoryExpanded] = useState(false);

  const canMutate = role === PROPERTY_ROLES.OWNER || role === PROPERTY_ROLES.EDITOR;
  const addHref = `${ROUTES.properties}/${propertyId}/meters/new`;

  const activeMeters = meters.filter((r) => r.meter.validTo === null);
  const historicalMeters = meters.filter((r) => r.meter.validTo !== null);

  return (
    <>
      {activeMeters.length === 0 ? (
        <EmptyStateCard
          icon={Gauge}
          title={t("empty.title")}
          body={t("empty.body")}
          variant="block"
          cta={
            canMutate && (
              <LinkButton
                href={addHref}
                icon={Plus}
                text={t("empty.cta")}
                variant="default"
                size="default"
              />
            )
          }
        />
      ) : (
        <SectionCard
          className="overflow-hidden"
          title={t("sectionTitle")}
          description={`${t("count", { count: activeMeters.length })} · ${t("subtitleHint")}`}
          actions={
            canMutate && (
              <LinkButton
                variant="default"
                href={addHref}
                icon={Plus}
                text={t("addButton")}
                size="sm"
              />
            )
          }
        >
          {activeMeters.map((r, index) => (
            <ActiveMeterRow
              key={r.meter.id}
              meter={r.meter}
              serviceType={r.serviceType}
              propertyId={propertyId}
              canMutate={canMutate}
              isLast={index === activeMeters.length - 1}
            />
          ))}
        </SectionCard>
      )}

      {historicalMeters.length > 0 && (
        <div className="mt-7">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setHistoryExpanded((v) => !v)}
            className="text-muted-foreground hover:text-foreground px-0"
          >
            {historyExpanded ? <ChevronUp /> : <ChevronDown />}
            {t("history", { count: historicalMeters.length })}
          </Button>

          {historyExpanded && (
            <div className="mt-3 flex flex-col gap-2">
              {historicalMeters.map((r) => (
                <MeterRow
                  key={r.meter.id}
                  meter={r.meter}
                  serviceType={r.serviceType}
                  propertyId={propertyId}
                  canMutate={false}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

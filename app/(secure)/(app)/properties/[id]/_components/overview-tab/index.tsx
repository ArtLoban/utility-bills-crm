import { Lightbulb, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { LinkButton } from "@/components/link-button";
import { EmptyStateCard } from "@/components/empty-state-card";
import { SectionCard } from "@/components/section-card";
import type { TServiceListItem } from "@/lib/db/access/services";
import { PROPERTY_ROLES } from "@/lib/db/schema/properties";
import type { TPropertyRole } from "@/lib/db/schema/properties";
import type { TServiceId } from "@/lib/db/schema/services";
import type { TBalance } from "@/features/ledger/types";
import { ServiceRow } from "./service-row";
import { ROUTES } from "@/lib/routes";

type TProps = {
  services: TServiceListItem[];
  role: TPropertyRole;
  propertyId: string;
  serviceBalances: Map<TServiceId, TBalance>;
  lastReadingByService: Map<TServiceId, Date>;
};

export const OverviewTab = ({
  services,
  role,
  propertyId,
  serviceBalances,
  lastReadingByService,
}: TProps) => {
  const t = useTranslations("properties.detail");
  const canEdit = role !== PROPERTY_ROLES.VIEWER;
  const addHref = `${ROUTES.properties}/${propertyId}/services/new`;

  if (services.length === 0) {
    return (
      <EmptyStateCard
        icon={Lightbulb}
        title={t("empty.title")}
        body={t("empty.body")}
        variant="block"
        cta={
          canEdit && (
            <LinkButton
              href={addHref}
              icon={Plus}
              text={t("actions.addService")}
              variant="default"
              size="default"
            />
          )
        }
      />
    );
  }

  return (
    <SectionCard
      className="overflow-hidden"
      title={t("sectionTitle")}
      description={`${t("services", { count: services.length })} · ${t("tapHint")}`}
      actions={
        canEdit && (
          <LinkButton
            variant="default"
            href={addHref}
            icon={Plus}
            text={t("actions.addService")}
            size="sm"
          />
        )
      }
    >
      {services.map(({ service, serviceType, currentContract }, index) => (
        <ServiceRow
          key={service.id}
          service={service}
          serviceType={serviceType}
          providerName={currentContract?.provider.name ?? null}
          propertyId={propertyId}
          isLast={index === services.length - 1}
          balance={serviceBalances.get(service.id) ?? null}
          lastReadingAt={lastReadingByService.get(service.id) ?? null}
        />
      ))}
    </SectionCard>
  );
};

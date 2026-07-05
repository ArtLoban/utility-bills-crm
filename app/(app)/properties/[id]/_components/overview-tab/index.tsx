import { Lightbulb, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { LinkButton } from "@/components/link-button";
import { Card } from "@/components/ui/card";
import type { TServiceListItem } from "@/lib/db/access/services";
import { PROPERTY_ROLES } from "@/lib/db/schema/properties";
import type { TPropertyRole } from "@/lib/db/schema/properties";
import type { TServiceId } from "@/lib/db/schema/services";
import type { TBalance } from "@/features/ledger/types";
import { ServiceRow } from "./service-row";

type TProps = {
  services: TServiceListItem[];
  role: TPropertyRole;
  propertyId: string;
  serviceBalances: Map<TServiceId, TBalance>;
  lastReadingByService: Map<TServiceId, Date>;
};

const OverviewTab = ({
  services,
  role,
  propertyId,
  serviceBalances,
  lastReadingByService,
}: TProps) => {
  const t = useTranslations("properties.detail");
  const canEdit = role !== PROPERTY_ROLES.VIEWER;
  const addHref = `/properties/${propertyId}/services/new`;

  if (services.length === 0) {
    return (
      <Card className="overflow-hidden rounded-lg p-0">
        <div className="flex justify-center px-6 py-12">
          <div className="flex max-w-sm flex-col items-center gap-4 text-center">
            <div className="bg-muted flex h-16 w-16 items-center justify-center rounded-2xl">
              <Lightbulb size={32} className="text-muted-foreground" />
            </div>
            <div>
              <p className="text-foreground text-lg font-semibold">{t("empty.title")}</p>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                {t("empty.body")}
              </p>
            </div>
            {canEdit && (
              <LinkButton
                href={addHref}
                icon={Plus}
                text={t("actions.addService")}
                variant="default"
                size="default"
              />
            )}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="gap-0 overflow-hidden rounded-lg p-0">
      <div className="border-border flex items-center justify-between border-b px-6 py-4.5">
        <div>
          <p className="text-foreground text-sm font-semibold">{t("sectionTitle")}</p>
          <p className="text-muted-foreground mt-0.5 text-xs">
            {t("services", { count: services.length })} · {t("tapHint")}
          </p>
        </div>
        {canEdit && (
          <LinkButton
            variant="default"
            href={addHref}
            icon={Plus}
            text={t("actions.addService")}
            size="sm"
          />
        )}
      </div>

      <div>
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
      </div>
    </Card>
  );
};

export { OverviewTab };

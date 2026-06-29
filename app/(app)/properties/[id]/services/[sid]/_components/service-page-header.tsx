import type { ReactNode } from "react";
import { Pencil } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { LinkButton } from "@/components/link-button";
import { ROUTES } from "@/lib/routes";
import { PROPERTY_ROLES } from "@/lib/db/schema/properties";
import type { TPropertyRole } from "@/lib/db/schema/properties";
import type { TService } from "@/lib/db/schema/services";
import type { TServiceType } from "@/lib/db/schema/service-types";
import { getServiceTypeVisuals, TServiceTypeCode } from "@/features/services/service-type";
import { IconBadge } from "@/components/icon-badge";

type TProps = {
  service: TService;
  serviceType: TServiceType;
  role: TPropertyRole;
  propertyId: string;
  propertyName: string;
  providerName?: string | null;
  extraActions?: ReactNode;
};

export const ServicePageHeader = async ({
  service,
  serviceType,
  role,
  propertyId,
  propertyName,
  providerName,
  extraActions,
}: TProps) => {
  const [tTypes, t, tNav] = await Promise.all([
    getTranslations("services.types"),
    getTranslations("services.detail.header"),
    getTranslations("nav"),
  ]);
  const name = tTypes(serviceType.code as Parameters<typeof tTypes>[0]);
  const { color, Icon } = getServiceTypeVisuals(serviceType.code as TServiceTypeCode);
  const editHref = `${ROUTES.properties}/${propertyId}/services/${service.id}/edit`;

  return (
    <div className="mb-5 md:mb-7">
      <Breadcrumbs
        items={[
          { label: tNav("properties"), href: ROUTES.properties },
          { label: propertyName, href: `${ROUTES.properties}/${propertyId}` },
          { label: name },
        ]}
      />

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-3 md:gap-4">
          <IconBadge icon={Icon} color={color} size="lg" border />

          <div className="min-w-0 flex-1">
            <h1 className="text-foreground text-2xl font-semibold tracking-[-0.6px] md:text-[28px]">
              {name}
            </h1>
            <p className="text-muted-foreground text-sm">
              {providerName ? `${providerName} · ${propertyName}` : propertyName}
            </p>
          </div>
        </div>

        {role !== PROPERTY_ROLES.VIEWER && (
          <div className="flex items-center justify-end gap-2">
            <LinkButton href={editHref} icon={Pencil} text={t("editNotes")} size="default" />
            {extraActions}
          </div>
        )}
      </div>
    </div>
  );
};

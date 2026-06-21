import type { ReactNode } from "react";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";
import type { TPropertyRole } from "@/lib/db/schema/properties";
import type { TService } from "@/lib/db/schema/services";
import type { TServiceType } from "@/lib/db/schema/service-types";
import { getServiceTypeVisuals, TServiceTypeCode } from "@/features/services/service-type";

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
  const [tTypes, t] = await Promise.all([
    getTranslations("services.types"),
    getTranslations("services.detail.header"),
  ]);
  const name = tTypes(serviceType.code as Parameters<typeof tTypes>[0]);
  const { color, Icon } = getServiceTypeVisuals(serviceType.code as TServiceTypeCode);
  const editHref = `${ROUTES.properties}/${propertyId}/services/${service.id}/edit`;

  return (
    <div className="mb-7">
      <Breadcrumbs
        items={[
          { label: t("home"), href: ROUTES.home },
          { label: propertyName, href: `${ROUTES.properties}/${propertyId}` },
          { label: name },
        ]}
      />

      <div className="flex items-center gap-4">
        <div
          className="flex size-11 shrink-0 items-center justify-center rounded-[10px]"
          style={{
            background: `color-mix(in srgb, ${color} 9%, transparent)`,
            border: `1.5px solid color-mix(in srgb, ${color} 30%, transparent)`,
          }}
        >
          <Icon size={22} style={{ color }} />
        </div>

        <div className="min-w-0 flex-1">
          <h1 className="text-foreground text-2xl font-semibold tracking-[-0.6px] md:text-[28px]">
            {name}
          </h1>
          <p className="text-muted-foreground text-sm">
            {providerName ? `${providerName} · ${propertyName}` : propertyName}
          </p>
        </div>

        {role !== "viewer" && (
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link href={editHref}>
                <Pencil className="size-3.5" />
                {t("editNotes")}
              </Link>
            </Button>
            {extraActions}
          </div>
        )}
      </div>
    </div>
  );
};

import { Pencil } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { LinkButton } from "@/components/link-button";
import { ROUTES } from "@/lib/routes";
import type { TServiceId } from "@/lib/db/schema/services";

import { OverflowMenu } from "./components/overflow-menu";

type TProps = {
  serviceId: TServiceId;
  propertyId: string;
  serviceName: string;
  canEdit: boolean;
};

export const PageActions = async ({ serviceId, propertyId, serviceName, canEdit }: TProps) => {
  if (!canEdit) return null;

  const t = await getTranslations("services.detail.header");

  return (
    <div className="flex items-center gap-2">
      <LinkButton
        href={`${ROUTES.properties}/${propertyId}/services/${serviceId}/edit`}
        icon={Pencil}
        text={t("editService")}
        size="default"
      />
      <OverflowMenu serviceId={serviceId} propertyId={propertyId} serviceName={serviceName} />
    </div>
  );
};

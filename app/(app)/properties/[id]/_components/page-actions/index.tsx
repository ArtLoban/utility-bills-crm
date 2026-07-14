import { Pencil } from "lucide-react";
import { useTranslations } from "next-intl";

import { LinkButton } from "@/components/link-button";
import { ROUTES } from "@/lib/routes";
import { PROPERTY_ROLES } from "@/lib/db/schema/properties";
import type { TPropertyDetail } from "@/app/(app)/properties/[id]/_data/queries";

import { OverflowMenu } from "./components/overflow-menu";

type TProps = {
  property: TPropertyDetail;
};

export const PageActions = ({ property }: TProps) => {
  const t = useTranslations("properties.detail.actions");

  if (property.role !== PROPERTY_ROLES.OWNER) return null;

  return (
    <div className="flex shrink-0 items-center gap-2">
      <LinkButton
        href={`${ROUTES.properties}/${property.id}/edit`}
        icon={Pencil}
        text={t("edit")}
        size="default"
      />
      <OverflowMenu propertyId={property.id} propertyName={property.name} />
    </div>
  );
};

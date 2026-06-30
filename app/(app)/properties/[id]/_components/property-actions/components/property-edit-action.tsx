import { Pencil } from "lucide-react";
import { useTranslations } from "next-intl";
import { LinkButton } from "@/components/link-button";
import { ROUTES } from "@/lib/routes";
import type { TPropertyDetail } from "@/app/(app)/properties/[id]/_data/queries";
import { PROPERTY_ROLES } from "@/lib/db/schema/properties";

type TProps = { property: TPropertyDetail };

export const PropertyEditAction = ({ property }: TProps) => {
  const t = useTranslations("properties.detail.actions");

  if (property.role !== PROPERTY_ROLES.OWNER) return null;

  return (
    <LinkButton
      href={`${ROUTES.properties}/${property.id}/edit`}
      icon={Pencil}
      text={t("edit")}
      size="default"
    />
  );
};

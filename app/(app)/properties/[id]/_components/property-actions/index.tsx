import { Share2 } from "lucide-react";
import { LinkButton } from "@/components/link-button";
import { ROUTES } from "@/lib/routes";
import { PropertyEditAction } from "./components/property-edit-action";
import { PropertyDeleteAction } from "./components/property-delete-action";
import type { TPropertyDetail } from "@/app/(app)/properties/[id]/_data/queries";
import { PROPERTY_ROLES } from "@/lib/db/schema/properties";

type TProps = {
  property: TPropertyDetail;
};

export const PropertyActions = ({ property }: TProps) => (
  <div className="flex shrink-0 items-center gap-2">
    <PropertyEditAction property={property} />
    {property.role !== PROPERTY_ROLES.VIEWER && (
      <LinkButton
        href={`${ROUTES.properties}/${property.id}/sharing`}
        icon={Share2}
        text="Share"
        size="default"
      />
    )}
    <PropertyDeleteAction
      propertyId={property.id}
      propertyName={property.name}
      role={property.role}
    />
  </div>
);

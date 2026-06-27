import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import Link from "next/link";
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
      <Button asChild variant="outline">
        <Link href={`${ROUTES.properties}/${property.id}/sharing`}>
          <Share2 size={13} />
          Share
        </Link>
      </Button>
    )}
    <PropertyDeleteAction
      propertyId={property.id}
      propertyName={property.name}
      role={property.role}
    />
  </div>
);

import { PropertyEditAction } from "./components/property-edit-action";
import { PropertyDeleteAction } from "./components/property-delete-action";
import type { TPropertyDetail } from "@/app/(app)/properties/[id]/_data/queries";

type TProps = {
  property: TPropertyDetail;
};

export const PropertyActions = ({ property }: TProps) => {
  return (
    <div className="flex shrink-0 items-center gap-2">
      <PropertyEditAction property={property} />
      <PropertyDeleteAction
        propertyId={property.id}
        propertyName={property.name}
        role={property.role}
      />
    </div>
  );
};

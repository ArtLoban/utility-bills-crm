import { PropertyCard } from "./property-card";
import type { TPropertyListItem } from "@/app/(app)/properties/_data/queries";

type TProps = {
  properties: TPropertyListItem[];
};

export const Properties = ({ properties }: TProps) => {
  return (
    <div className="grid grid-cols-3 gap-5">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
};

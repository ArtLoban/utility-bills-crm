import { PropertyCard } from "./property-card";
import type { TPropertyListItem } from "@/app/(secure)/(app)/properties/_data/queries";

type TProps = {
  properties: TPropertyListItem[];
};

export const Properties = ({ properties }: TProps) => {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
};

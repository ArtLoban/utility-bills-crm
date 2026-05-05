import { FC } from "react";
import { PropertyCard } from "./property-card";
import { TProperty } from "@/app/(app)/properties/_data/mock";

export type TProps = {
  properties: TProperty[];
};

export const Properties: FC<TProps> = ({ properties }) => {
  return (
    <div className="grid grid-cols-3 gap-5">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
};

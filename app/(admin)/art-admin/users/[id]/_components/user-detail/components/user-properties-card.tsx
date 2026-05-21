import { DataCard } from "@/components/data-card";
import { type TUserPropertyAccess } from "../../../_data/mock";
import { PropertyRow } from "./property-row";

type TProps = { properties: TUserPropertyAccess[] };

export const UserPropertiesCard = ({ properties }: TProps) => {
  const count = properties.length;
  const description =
    count === 0
      ? "No properties"
      : `${count} ${count === 1 ? "property" : "properties"} accessible to this user`;

  return (
    <DataCard className="overflow-hidden">
      <div className="border-border border-b px-6 py-4">
        <h3 className="text-sm font-semibold">Properties</h3>
        <p className="text-muted-foreground mt-0.5 text-xs">{description}</p>
      </div>

      {count === 0 ? (
        <p className="text-muted-foreground px-6 py-5 text-sm">
          This user has no access to any properties.
        </p>
      ) : (
        <div>
          {properties.map((property, i) => (
            <PropertyRow key={property.id} property={property} isLast={i === count - 1} />
          ))}
        </div>
      )}
    </DataCard>
  );
};

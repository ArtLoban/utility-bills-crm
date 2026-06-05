import { DataCard } from "@/components/data-card";
import type { TAdminUserPropertyAccess } from "@/features/admin-users/types";
import { PropertyRow } from "./property-row";

type TProps = {
  userId: string;
  properties: TAdminUserPropertyAccess[];
};

export const UserPropertiesCard = async ({ userId, properties }: TProps) => {
  const count = properties.length;

  return (
    <DataCard className="overflow-hidden">
      <div className="border-border border-b px-6 py-4">
        <h3 className="text-sm font-semibold">Properties</h3>
        {count > 0 && (
          <p className="text-muted-foreground mt-0.5 text-xs">
            {count === 1
              ? "1 property accessible to this user"
              : `${count} properties accessible to this user`}
          </p>
        )}
      </div>

      {count === 0 ? (
        <p className="text-muted-foreground px-6 py-5 text-sm">
          This user has no access to any properties.
        </p>
      ) : (
        <div>
          {properties.map((property, i) => (
            <PropertyRow
              key={property.propertyId}
              property={property}
              userId={userId}
              isLast={i === count - 1}
            />
          ))}
        </div>
      )}
    </DataCard>
  );
};

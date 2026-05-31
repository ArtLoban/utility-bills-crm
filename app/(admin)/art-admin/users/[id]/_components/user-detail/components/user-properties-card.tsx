import { getTranslations } from "next-intl/server";

import { DataCard } from "@/components/data-card";
import type { TAdminUserPropertyAccess } from "@/features/admin-users/types";
import { PropertyRow } from "./property-row";

type TProps = {
  userId: string;
  properties: TAdminUserPropertyAccess[];
};

export const UserPropertiesCard = async ({ userId, properties }: TProps) => {
  const t = await getTranslations("adminUsers.detail");
  const count = properties.length;

  return (
    <DataCard className="overflow-hidden">
      <div className="border-border border-b px-6 py-4">
        <h3 className="text-sm font-semibold">{t("properties")}</h3>
        {count > 0 && (
          <p className="text-muted-foreground mt-0.5 text-xs">
            {t("propertiesDescription", { count })}
          </p>
        )}
      </div>

      {count === 0 ? (
        <p className="text-muted-foreground px-6 py-5 text-sm">{t("propertiesEmpty")}</p>
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

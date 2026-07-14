import { PROPERTY_ROLES } from "@/lib/db/schema/properties";
import type { TAdminPropertyDetail } from "@/features/admin-properties";

export const formatOwners = (owners: TAdminPropertyDetail["owners"]): string => {
  if (owners.length === 0) return "—";
  return (
    owners
      .filter((o) => o.propertyRole === PROPERTY_ROLES.OWNER)
      .map((o) => o.name ?? o.email)
      .join(", ") || "—"
  );
};

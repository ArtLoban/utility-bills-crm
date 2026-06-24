import { format } from "date-fns";

import { capitalize } from "@/lib/utils/capitalize";
import { DataCard } from "@/components/data-card";
import { InfoGrid } from "@/components/info-grid";
import { PROPERTY_ROLES } from "@/lib/db/schema/properties";
import type { TAdminPropertyDetail } from "@/features/admin-properties";

type TProps = { property: TAdminPropertyDetail };

const formatOwners = (owners: TAdminPropertyDetail["owners"]): string => {
  if (owners.length === 0) return "—";
  return (
    owners
      .filter((o) => o.propertyRole === PROPERTY_ROLES.OWNER)
      .map((o) => o.name ?? o.email)
      .join(", ") || "—"
  );
};

export const PropertyInfoCard = ({ property }: TProps) => {
  const rows = [
    { label: "Owner", value: formatOwners(property.owners) },
    { label: "Type", value: capitalize(property.type) },
    { label: "Address", value: property.address ?? "—" },
    { label: "Notes", value: property.notes ?? "—" },
    { label: "Services", value: String(property.servicesCount) },
    { label: "Created", value: format(property.createdAt, "MMMM d, yyyy") },
    { label: "Updated", value: format(property.updatedAt, "MMMM d, yyyy") },
    {
      label: "Status",
      value: property.deletedAt
        ? `Deleted — ${format(property.deletedAt, "MMMM d, yyyy")}`
        : "Active",
    },
  ];

  return (
    <DataCard className="overflow-hidden">
      <div className="border-border border-b px-6 py-4">
        <h3 className="text-sm font-semibold">Property information</h3>
      </div>
      <div className="px-6">
        <InfoGrid rows={rows} />
      </div>
    </DataCard>
  );
};

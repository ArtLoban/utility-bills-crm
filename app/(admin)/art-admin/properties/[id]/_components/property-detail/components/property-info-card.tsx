import { format } from "date-fns";

import { DataCard } from "@/components/data-card";
import { InfoGrid } from "@/components/info-grid";
import type { TAdminPropertyDetail } from "@/features/admin-properties";

type TProps = { property: TAdminPropertyDetail };

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const formatOwners = (owners: TAdminPropertyDetail["owners"]): string => {
  if (owners.length === 0) return "—";
  return (
    owners
      .filter((o) => o.propertyRole === "owner")
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

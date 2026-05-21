import { DataCard } from "@/components/data-card";
import { InfoGrid } from "@/components/info-grid";
import { type TPropertyDetail } from "../../../_data/mock";

type TProps = { property: TPropertyDetail };

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const formatOwners = (owners: TPropertyDetail["owners"]): string => {
  const primary = owners[0];
  if (!primary) return "—";
  return owners.length === 1 ? primary.name : `${primary.name} (+${owners.length - 1})`;
};

export const PropertyInfoCard = ({ property }: TProps) => {
  const baseRows = [
    { label: "Owner(s)", value: formatOwners(property.owners) },
    { label: "Type", value: capitalize(property.type) },
    { label: "Address", value: property.address },
    {
      label: "Services",
      value:
        property.status === "deleted"
          ? `${property.servicesCount} — ${property.serviceNames.join(", ")}`
          : String(property.servicesCount),
    },
    {
      label: "Created",
      value:
        property.status === "active"
          ? `${property.createdDisplay} by ${property.createdBy}`
          : property.createdDisplay,
    },
    { label: "Last activity", value: property.lastActivity },
  ];

  const statusRows =
    property.status === "deleted"
      ? [
          { label: "Soft-deleted at", value: property.deletedAt },
          { label: "Soft-deleted by", value: `${property.deletedBy} (owner)` },
        ]
      : [{ label: "Status", value: "Active" }];

  return (
    <DataCard className="overflow-hidden">
      <div className="border-border border-b px-6 py-4">
        <h3 className="text-sm font-semibold">Property info</h3>
      </div>
      <div className="px-6">
        <InfoGrid rows={[...baseRows, ...statusRows]} />
      </div>
    </DataCard>
  );
};

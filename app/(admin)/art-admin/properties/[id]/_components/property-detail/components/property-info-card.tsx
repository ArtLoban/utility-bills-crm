import { format } from "date-fns";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("adminProperties");

  const rows = [
    { label: t("detail.fields.owner"), value: formatOwners(property.owners) },
    { label: t("detail.fields.type"), value: capitalize(property.type) },
    { label: t("detail.fields.address"), value: property.address ?? "—" },
    { label: t("detail.fields.notes"), value: property.notes ?? "—" },
    {
      label: t("detail.fields.services"),
      value: String(property.servicesCount),
    },
    {
      label: t("detail.fields.created"),
      value: format(property.createdAt, "MMMM d, yyyy"),
    },
    {
      label: t("detail.fields.updated"),
      value: format(property.updatedAt, "MMMM d, yyyy"),
    },
    {
      label: t("detail.fields.status"),
      value: property.deletedAt
        ? `${t("status.deleted")} — ${format(property.deletedAt, "MMMM d, yyyy")}`
        : t("status.active"),
    },
  ];

  return (
    <DataCard className="overflow-hidden">
      <div className="border-border border-b px-6 py-4">
        <h3 className="text-sm font-semibold">{t("detail.infoCard.title")}</h3>
      </div>
      <div className="px-6">
        <InfoGrid rows={rows} />
      </div>
    </DataCard>
  );
};

import { capitalize } from "@/lib/utils/capitalize";
import { formatDisplayDate } from "@/lib/format/date";
import type { TInfoRow } from "@/components/info-grid/types";
import type { TAdminPropertyDetail } from "@/features/admin-properties";
import { formatOwners } from "./format-owners";

export const buildInfoRows = (property: TAdminPropertyDetail): TInfoRow[] => {
  const { owners, type, address, notes, servicesCount, createdAt, updatedAt, deletedAt } = property;

  return [
    { label: "Owner", value: formatOwners(owners) },
    { label: "Type", value: capitalize(type) },
    { label: "Address", value: address ?? "—" },
    { label: "Notes", value: notes ?? "—" },
    { label: "Services", value: String(servicesCount) },
    { label: "Created", value: formatDisplayDate(createdAt) },
    { label: "Updated", value: formatDisplayDate(updatedAt) },
    {
      label: "Status",
      value: deletedAt ? `Deleted — ${formatDisplayDate(deletedAt)}` : "Active",
    },
  ];
};

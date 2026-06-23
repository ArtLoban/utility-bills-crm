import type { TAdminPropertyRow } from "@/features/admin-properties/types";

export const formatOwners = (owners: TAdminPropertyRow["owners"]): string => {
  const primary = owners[0];
  if (!primary) return "—";

  return owners.length === 1
    ? (primary.name ?? primary.email)
    : `${primary.name ?? primary.email} (+${owners.length - 1})`;
};

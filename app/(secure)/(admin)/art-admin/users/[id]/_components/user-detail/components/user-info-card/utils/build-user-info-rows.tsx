import { formatDisplayDate, formatRelativeTime } from "@/lib/format/date";
import { RoleBadge } from "@/app/(secure)/(admin)/art-admin/users/_components/role-badge";
import type { TInfoRow } from "@/components/info-grid/types";
import type { TAdminUserDetailResult } from "@/features/admin-users/types";

export const buildUserInfoRows = (user: TAdminUserDetailResult): TInfoRow[] => {
  const { email, name, systemRole, createdAt, lastLoginAt } = user;

  const lastLogin = lastLoginAt ? formatRelativeTime(lastLoginAt) : "Never";

  return [
    { label: "Email", value: email },
    { label: "Name", value: name ?? "—" },
    { label: "System role", value: <RoleBadge role={systemRole} /> },
    { label: "Created", value: formatDisplayDate(createdAt) },
    { label: "Last login", value: lastLogin },
  ];
};

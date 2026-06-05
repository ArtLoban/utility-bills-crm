import { format } from "date-fns";
import { formatDistanceToNow } from "date-fns";

import { DataCard } from "@/components/data-card";
import { InfoGrid } from "@/components/info-grid";
import type { TAdminUserDetailResult } from "@/features/admin-users/types";
import { RoleBadge } from "../../../../_components/role-badge";

type TProps = { user: TAdminUserDetailResult };

export const UserInfoCard = async ({ user }: TProps) => {
  const lastLoginValue = user.lastLoginAt
    ? formatDistanceToNow(user.lastLoginAt, { addSuffix: true })
    : "Never";

  const rows = [
    { label: "Email", value: user.email },
    { label: "Name", value: user.name ?? "—" },
    { label: "System role", value: <RoleBadge role={user.systemRole} /> },
    { label: "Created", value: format(user.createdAt, "MMMM d, yyyy") },
    { label: "Last login", value: lastLoginValue },
  ];

  return (
    <DataCard className="overflow-hidden">
      <div className="border-border border-b px-6 py-4">
        <h3 className="text-sm font-semibold">User info</h3>
      </div>
      <div className="px-6">
        <InfoGrid rows={rows} />
      </div>
    </DataCard>
  );
};

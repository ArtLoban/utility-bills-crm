import { DataCard } from "@/components/data-card";
import { InfoGrid } from "@/components/info-grid";
import { RoleBadge } from "../../../../_components/role-badge";
import { type TAdminUserDetail } from "../../../_data/mock";

type TProps = { user: TAdminUserDetail };

const AUTH_PROVIDER_LABELS: Record<TAdminUserDetail["authProvider"], string> = {
  google: "Google",
  email: "Email / password",
};

export const UserInfoCard = ({ user }: TProps) => {
  const rows = [
    { label: "Email", value: user.email },
    { label: "Name", value: user.name },
    { label: "System role", value: <RoleBadge role={user.systemRole} /> },
    { label: "Created", value: user.createdDisplay },
    { label: "Last login", value: user.lastLoginDisplay },
    { label: "Auth provider", value: AUTH_PROVIDER_LABELS[user.authProvider] },
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

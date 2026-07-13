import { InfoGrid } from "@/components/info-grid";
import type { TAdminUserDetailResult } from "@/features/admin-users/types";
import { buildUserInfoRows } from "./utils/build-user-info-rows";
import { Surface } from "@/components/surface";

type TProps = {
  user: TAdminUserDetailResult;
};

export const UserInfoCard = ({ user }: TProps) => {
  const rows = buildUserInfoRows(user);

  return (
    <Surface>
      <div className="border-border border-b px-6 py-4">
        <h3 className="text-sm font-semibold">User info</h3>
      </div>
      <div className="px-6">
        <InfoGrid rows={rows} />
      </div>
    </Surface>
  );
};

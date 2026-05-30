import { cn } from "@/lib/utils";
import { PageContainer } from "@/components/page-container";
import { PageMeta } from "@/components/page-meta";
import { RECORD_STATUS } from "@/lib/types/record-status";

import { type TAdminUserDetail } from "../../_data/mock";
import { RoleBadge } from "../../../_components/role-badge";
import { DeletedBanner } from "./components/deleted-banner";
import { UserInfoCard } from "./components/user-info-card";
import { UserPropertiesCard } from "./components/user-properties-card";

type TProps = { user: TAdminUserDetail };

export const UserDetail = ({ user }: TProps) => {
  const isDeleted = user.status === RECORD_STATUS.DELETED;

  const metaItems = [
    user.email,
    <RoleBadge key="role" role={user.systemRole} />,
    `Joined ${user.createdDisplay}`,
  ];

  return (
    <PageContainer
      title={
        <span className={cn(isDeleted && "decoration-muted-foreground line-through opacity-65")}>
          {user.name}
        </span>
      }
      meta={<PageMeta items={metaItems} />}
      breadcrumbs={[
        { label: "art-admin", href: "/art-admin" },
        { label: "users", href: "/art-admin/users" },
        { label: user.name },
      ]}
      banner={isDeleted ? <DeletedBanner deletedAt={user.deletedAt} /> : undefined}
    >
      <div className="flex flex-col gap-4">
        <UserInfoCard user={user} />
        <UserPropertiesCard properties={user.properties} />
      </div>

      <div className="border-border mt-8 border-t pt-4">
        <p className="text-muted-foreground font-mono text-xs">User ID: {user.userId}</p>
        <p className="text-muted-foreground mt-0.5 text-xs">
          Internal record. For support reference only.
        </p>
      </div>
    </PageContainer>
  );
};

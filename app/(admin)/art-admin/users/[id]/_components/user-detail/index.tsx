import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/routes";
import { formatDisplayDate } from "@/lib/format/date";
import { PageContainer } from "@/components/page-container";
import { PageMeta } from "@/components/page-meta";
import { DemoBadge } from "@/app/(admin)/art-admin/_components/demo-badge";
import type { TAdminUserDetailResult } from "@/features/admin-users/types";
import { RoleBadge } from "../../../_components/role-badge";
import { DeletedBanner } from "./components/deleted-banner";
import { UserInfoCard } from "./components/user-info-card";
import { UserPropertiesCard } from "./components/user-properties-card";

type TProps = {
  user: TAdminUserDetailResult;
};

export const UserDetail = ({ user }: TProps) => {
  const isDeleted = user.deletedAt !== null;
  const displayName = user.name ?? user.email;

  const metaItems = [
    user.email,
    <RoleBadge key="role" role={user.systemRole} />,
    user.isDemo ? <DemoBadge key="demo" /> : null,
    `Joined ${formatDisplayDate(user.createdAt)}`,
  ].filter(Boolean);

  return (
    <PageContainer
      title={
        <span className={cn(isDeleted && "decoration-muted-foreground line-through opacity-65")}>
          {displayName}
        </span>
      }
      meta={<PageMeta items={metaItems} />}
      breadcrumbs={[
        { label: "art-admin", href: ROUTES.admin.root },
        { label: "users", href: ROUTES.admin.users },
        { label: displayName },
      ]}
      banner={isDeleted ? <DeletedBanner deletedAt={user.deletedAt!} /> : undefined}
    >
      <div className="flex flex-col gap-4">
        <UserInfoCard user={user} />
        <UserPropertiesCard userId={user.id} properties={user.properties} />
      </div>

      <div className="border-border mt-8 border-t pt-4">
        <p className="text-muted-foreground font-mono text-xs">User ID: {user.id}</p>
        <p className="text-muted-foreground mt-0.5 text-xs">
          Internal record. For support reference only.
        </p>
      </div>
    </PageContainer>
  );
};

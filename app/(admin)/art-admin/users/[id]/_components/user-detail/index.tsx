import { format } from "date-fns";
import { getTranslations } from "next-intl/server";

import { cn } from "@/lib/utils";
import { PageContainer } from "@/components/page-container";
import { PageMeta } from "@/components/page-meta";
import type { TAdminUserDetailResult } from "@/features/admin-users/types";

import { RoleBadge } from "../../../_components/role-badge";
import { DeletedBanner } from "./components/deleted-banner";
import { UserInfoCard } from "./components/user-info-card";
import { UserPropertiesCard } from "./components/user-properties-card";

type TProps = { user: TAdminUserDetailResult };

export const UserDetail = async ({ user }: TProps) => {
  const t = await getTranslations("adminUsers.detail");
  const isDeleted = user.deletedAt !== null;
  const displayName = user.name ?? user.email;

  const metaItems = [
    user.email,
    <RoleBadge key="role" role={user.systemRole} />,
    t("joinedMeta", { date: format(user.createdAt, "MMMM yyyy") }),
  ];

  return (
    <PageContainer
      title={
        <span className={cn(isDeleted && "decoration-muted-foreground line-through opacity-65")}>
          {displayName}
        </span>
      }
      meta={<PageMeta items={metaItems} />}
      breadcrumbs={[
        { label: "art-admin", href: "/art-admin" },
        { label: "users", href: "/art-admin/users" },
        { label: displayName },
      ]}
      banner={isDeleted ? <DeletedBanner deletedAt={user.deletedAt!} /> : undefined}
    >
      <div className="flex flex-col gap-4">
        <UserInfoCard user={user} />
        <UserPropertiesCard userId={user.id} properties={user.properties} />
      </div>

      <div className="border-border mt-8 border-t pt-4">
        <p className="text-muted-foreground font-mono text-xs">
          {t("footer.userId")} {user.id}
        </p>
        <p className="text-muted-foreground mt-0.5 text-xs">{t("footer.note")}</p>
      </div>
    </PageContainer>
  );
};

import { cn } from "@/lib/utils";
import { capitalize } from "@/lib/utils/capitalize";
import { getInitials } from "@/lib/utils/get-initials";
import type { TAdminPropertyOwnerDetail } from "@/features/admin-properties";

type TProps = {
  user: TAdminPropertyOwnerDetail;
  isLast: boolean;
};

export const SharingRow = ({ user, isLast }: TProps) => (
  <div className={cn("flex items-center gap-3 py-3", !isLast && "border-border border-b")}>
    <div className="bg-muted text-muted-foreground flex size-[30px] shrink-0 items-center justify-center rounded-full text-[10.5px] font-semibold">
      {getInitials(user.name, user.email)}
    </div>
    <span className="flex-1 text-sm font-medium">{user.name ?? user.email}</span>
    <span className="text-muted-foreground text-sm">{capitalize(user.propertyRole)}</span>
  </div>
);

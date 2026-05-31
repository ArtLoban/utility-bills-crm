import { cn } from "@/lib/utils";
import type { TAdminPropertyOwnerDetail } from "@/features/admin-properties";

type TProps = {
  user: TAdminPropertyOwnerDetail;
  isLast: boolean;
};

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const getInitials = (name: string | null, email: string): string => {
  if (name) {
    const parts = name.trim().split(/\s+/);
    return parts.length >= 2
      ? `${parts[0]![0]}${parts[1]![0]}`.toUpperCase()
      : name.slice(0, 2).toUpperCase();
  }
  return email.slice(0, 2).toUpperCase();
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

import { Badge } from "@/components/ui/badge";
import { SYSTEM_ROLES, type TSystemRole } from "@/lib/auth/constants";

type TProps = {
  role: TSystemRole;
};

export const RoleBadge = ({ role }: TProps) =>
  role === SYSTEM_ROLES.ADMIN ? (
    <Badge variant="outline" className="text-warning border-warning/30">
      Admin
    </Badge>
  ) : (
    <Badge variant="outline" className="text-muted-foreground">
      User
    </Badge>
  );

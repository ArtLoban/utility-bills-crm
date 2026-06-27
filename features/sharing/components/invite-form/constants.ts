import { PROPERTY_ROLES } from "@/lib/db/schema/properties";

export const INVITE_ROLE_ORDER = [
  PROPERTY_ROLES.VIEWER,
  PROPERTY_ROLES.EDITOR,
  PROPERTY_ROLES.OWNER,
] as const;

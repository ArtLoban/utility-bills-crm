import type { TPropertyRole } from "@/lib/db/schema/properties";
import type { UserId } from "@/lib/db/schema/auth";

export type TSharedMember = {
  id: UserId;
  name: string;
  email: string;
  role: TPropertyRole;
  isYou: boolean;
  meta: string;
};

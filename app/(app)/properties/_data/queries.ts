import { auth } from "@/lib/auth";
import { accessibleProperties } from "@/lib/db/access/properties";
import type { UserId } from "@/lib/db/schema/auth";
import type { TProperty, TPropertyRole } from "@/lib/db/schema/properties";

// Named by screen purpose, not field composition (per DATA_MODEL.md type naming convention).
// serviceCount and balance are NOT included — they arrive in Steps 3 and 6 respectively.
export type TPropertyListItem = TProperty & {
  role: TPropertyRole;
};

export const getPropertyList = async (): Promise<TPropertyListItem[]> => {
  const session = await auth();
  if (!session?.user.id) return [];

  const userId = session.user.id as UserId;
  const rows = await accessibleProperties(userId);
  return rows.map(({ property, role }) => ({ ...property, role }));
};

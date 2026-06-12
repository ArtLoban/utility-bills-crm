import { requireUser } from "@/lib/auth/guards";
import { accessibleProperties } from "@/lib/db/access/properties";
import type { PropertyId, TProperty, TPropertyRole } from "@/lib/db/schema/properties";
import { balancesForProperties } from "@/features/ledger";
import type { TBalance } from "@/features/ledger";

// Named by screen purpose, not field composition (per DATA_MODEL.md type naming convention).
export type TPropertyListItem = TProperty & {
  role: TPropertyRole;
  balance: TBalance;
};

export const getPropertyList = async (): Promise<TPropertyListItem[]> => {
  const userId = await requireUser();
  const rows = await accessibleProperties(userId);

  const propertyIds = rows.map(({ property }) => property.id);
  const balancesMap = await balancesForProperties(userId, propertyIds);

  return rows.map(({ property, role }) => ({
    ...property,
    role,
    balance: balancesMap.get(property.id as PropertyId) ?? {
      billsTotal: 0,
      paymentsTotal: 0,
      balance: 0,
    },
  }));
};

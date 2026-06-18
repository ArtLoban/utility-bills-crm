import { count, isNotNull, isNull } from "drizzle-orm";

import { db } from "@/lib/db/client";
import { users } from "@/lib/db/schema/auth";
import { properties } from "@/lib/db/schema/properties";
import { bills } from "@/lib/db/schema/bills";
import { requireAdmin } from "@/lib/auth/guards";
import { unwrapOrThrow } from "@/lib/unwrap-or-throw";
import type { TAdminDashboardStats } from "./types";

// Verifies admin session as a third defense-in-depth layer.
// Layer 1: (admin) layout guard. Layer 2: page-level requireAdmin(). Layer 3: here.
const assertAdmin = async (): Promise<void> => {
  await unwrapOrThrow(await requireAdmin());
};

export const getAdminDashboardStats = async (): Promise<TAdminDashboardStats> => {
  await assertAdmin();

  const [[usersActive], [propertiesActive], [billsActive], [propertiesDeleted]] = await Promise.all(
    [
      db.select({ c: count() }).from(users).where(isNull(users.deletedAt)),
      db.select({ c: count() }).from(properties).where(isNull(properties.deletedAt)),
      db.select({ c: count() }).from(bills).where(isNull(bills.deletedAt)),
      db.select({ c: count() }).from(properties).where(isNotNull(properties.deletedAt)),
    ],
  );

  return {
    users: Number(usersActive!.c),
    properties: Number(propertiesActive!.c),
    bills: Number(billsActive!.c),
    softDeleted: Number(propertiesDeleted!.c),
  };
};

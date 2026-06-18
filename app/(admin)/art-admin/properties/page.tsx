import type { Metadata } from "next";
import { eq } from "drizzle-orm";

import { requireAdmin } from "@/lib/auth/guards";
import { unwrapOrThrow } from "@/lib/unwrap-or-throw";
import { db } from "@/lib/db/client";
import { users } from "@/lib/db/schema/auth";
import type { UserId } from "@/lib/db/schema/auth";
import { getAdminPropertiesList, parseAdminPropertiesParams } from "@/features/admin-properties";

import { PropertiesClient } from "./_components/properties-client";

export const metadata: Metadata = { title: "Properties — Admin" };

export default async function AdminPropertiesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  await unwrapOrThrow(await requireAdmin());

  const raw = await searchParams;
  const params = parseAdminPropertiesParams(raw);
  const result = await getAdminPropertiesList(params);

  // Resolve owner display name for the filter chip — only when ?owner= is present.
  let ownerName: string | null = null;
  if (params.owner) {
    const ownerRows = await db
      .select({ name: users.name, email: users.email })
      .from(users)
      .where(eq(users.id, params.owner as UserId))
      .limit(1);
    const found = ownerRows[0];
    ownerName = found?.name ?? found?.email ?? params.owner;
  }

  return (
    <PropertiesClient data={result.data} pagination={result.pagination} ownerName={ownerName} />
  );
}

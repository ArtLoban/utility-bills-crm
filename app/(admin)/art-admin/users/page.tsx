import type { Metadata } from "next";

import { requireAdmin } from "@/lib/auth/guards";
import { unwrapOrThrow } from "@/lib/unwrap-or-throw";
import { getAdminUsersList, parseAdminUsersParams } from "@/features/admin-users";

import { UsersClient } from "./_components/users-client";

export const metadata: Metadata = { title: "Users — Admin" };

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  await unwrapOrThrow(await requireAdmin());

  const raw = await searchParams;
  const params = parseAdminUsersParams(raw);
  const result = await getAdminUsersList(params);

  return <UsersClient data={result.data} pagination={result.pagination} />;
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { requireAdmin } from "@/lib/auth/guards";
import { shouldHideAsNotFound } from "@/lib/errors";
import { getAdminUsersList, parseAdminUsersParams } from "@/features/admin-users";

import { UsersClient } from "./_components/users-client";

export const metadata: Metadata = { title: "Users — Admin" };

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const guard = await requireAdmin();
  if (!guard.ok) {
    if (shouldHideAsNotFound(guard.error)) notFound();
    throw guard.error;
  }

  const raw = await searchParams;
  const params = parseAdminUsersParams(raw);
  const result = await getAdminUsersList(params);

  return <UsersClient data={result.data} pagination={result.pagination} />;
}

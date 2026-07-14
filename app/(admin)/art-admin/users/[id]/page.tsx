import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { requireAdmin } from "@/lib/auth/guards";
import { unwrapOrThrow } from "@/lib/unwrap-or-throw";
import { getAdminUserDetail } from "@/features/admin-users";

import { UserDetail } from "./_components/user-detail";

type TProps = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = { title: "User — Admin" };

export default async function AdminUserDetailPage({ params }: TProps) {
  const { id } = await params;

  await unwrapOrThrow(await requireAdmin());

  const user = await getAdminUserDetail(id);
  if (!user) notFound();

  return <UserDetail user={user} />;
}

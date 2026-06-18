import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { requireAdmin } from "@/lib/auth/guards";
import { unwrapOrThrow } from "@/lib/unwrap-or-throw";
import { getAdminUserDetail } from "@/features/admin-users";

import { UserDetail } from "./_components/user-detail";

type TProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: TProps): Promise<Metadata> {
  const { id } = await params;

  const guard = await requireAdmin();
  if (!guard.ok) return { title: "Not Found — Admin" };

  const user = await getAdminUserDetail(id);
  if (!user) return { title: "Not Found — Admin" };

  return { title: `${user.name ?? user.email} — Admin` };
}

export default async function AdminUserDetailPage({ params }: TProps) {
  const { id } = await params;

  await unwrapOrThrow(await requireAdmin());

  const user = await getAdminUserDetail(id);
  if (!user) notFound();

  return <UserDetail user={user} />;
}

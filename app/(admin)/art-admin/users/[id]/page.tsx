import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DETAIL_MOCK } from "./_data/mock";
import { UserDetail } from "./_components/user-detail";

type TProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: TProps): Promise<Metadata> {
  const { id } = await params;
  const user = DETAIL_MOCK[id];
  if (!user) return { title: "Not Found — Admin" };

  return { title: `${user.name} — Admin` };
}

export default async function AdminUserDetailPage({ params }: TProps) {
  const { id } = await params;
  const user = DETAIL_MOCK[id];
  if (!user) notFound();

  return <UserDetail user={user} />;
}

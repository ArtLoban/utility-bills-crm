import { notFound } from "next/navigation";

import { auth } from "@/lib/auth";
import { propertyMembers } from "@/features/sharing";
import { getPropertyDetail } from "@/app/(app)/properties/[id]/_data/queries";
import { RemoveUserModal } from "@/app/(app)/properties/[id]/_components/sharing-tab/components/remove-user-modal";
import type { PropertyId } from "@/lib/db/schema/properties";
import type { UserId } from "@/lib/db/schema/auth";

type TProps = {
  params: Promise<{ id: string; uid: string }>;
};

export default async function InterceptedRemoveUserPage({ params }: TProps) {
  const { id, uid } = await params;
  const propertyId = id as PropertyId;

  const session = await auth();
  const userId = session?.user?.id as UserId | undefined;
  if (!userId) notFound();

  const [membersResult, propertyResult] = await Promise.all([
    propertyMembers(userId, propertyId),
    getPropertyDetail(propertyId),
  ]);

  if (!membersResult.ok || !propertyResult.ok) notFound();

  const currentMember = membersResult.value.find((m) => m.userId === userId);
  if (currentMember?.role !== "owner") notFound();

  const targetMember = membersResult.value.find((m) => m.userId === uid);
  if (!targetMember) notFound();

  return (
    <RemoveUserModal
      member={targetMember}
      propertyId={id}
      propertyName={propertyResult.value.name}
    />
  );
}

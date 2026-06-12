import { notFound } from "next/navigation";

import { requireUser } from "@/lib/auth/guards";
import { propertyMembers } from "@/features/sharing";
import { getPropertyDetail } from "@/app/(app)/properties/[id]/_data/queries";
import { RemoveUserModal } from "@/app/(app)/properties/[id]/_components/sharing-tab/components/remove-user-modal";
import type { PropertyId } from "@/lib/db/schema/properties";

type TProps = {
  params: Promise<{ id: string; uid: string }>;
};

export default async function InterceptedRemoveUserPage({ params }: TProps) {
  const userId = await requireUser();
  const { id, uid } = await params;
  const propertyId = id as PropertyId;

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

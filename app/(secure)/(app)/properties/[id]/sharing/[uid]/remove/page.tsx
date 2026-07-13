import { notFound } from "next/navigation";

import { requireUser } from "@/lib/auth/guards";
import { propertyMembers, MemberRemoveDialog } from "@/features/sharing";
import { getPropertyDetail } from "../../../_data/queries";
import { PROPERTY_ROLES } from "@/lib/db/schema/properties";
import type { PropertyId } from "@/lib/db/schema/properties";

type TProps = {
  params: Promise<{ id: string; uid: string }>;
};

export default async function RemoveUserPage({ params }: TProps) {
  const userId = await requireUser();
  const { id, uid } = await params;
  const propertyId = id as PropertyId;

  const [membersResult, propertyResult] = await Promise.all([
    propertyMembers(userId, propertyId),
    getPropertyDetail(propertyId),
  ]);

  if (!membersResult.ok || !propertyResult.ok) notFound();

  const currentMember = membersResult.value.find((m) => m.userId === userId);
  if (currentMember?.role !== PROPERTY_ROLES.OWNER) notFound();

  const targetMember = membersResult.value.find((m) => m.userId === uid);
  if (!targetMember) notFound();

  return (
    <MemberRemoveDialog
      member={targetMember}
      propertyId={propertyId}
      propertyName={propertyResult.value.name}
    />
  );
}

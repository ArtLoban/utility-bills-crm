import { notFound } from "next/navigation";

import { getPropertyDetail } from "@/app/(secure)/(app)/properties/[id]/_data/queries";
import { InviteModal } from "@/features/sharing";
import { PROPERTY_ROLES, type PropertyId } from "@/lib/db/schema/properties";

type TProps = {
  params: Promise<{ id: string }>;
};

export default async function InterceptedInvitePage({ params }: TProps) {
  const { id } = await params;

  const propertyResult = await getPropertyDetail(id as PropertyId);
  if (!propertyResult.ok) notFound();
  if (propertyResult.value.role !== PROPERTY_ROLES.OWNER) notFound();

  return <InviteModal propertyId={id} />;
}

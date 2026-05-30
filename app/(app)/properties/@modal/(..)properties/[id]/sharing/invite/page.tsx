import { InviteModal } from "@/app/(app)/properties/[id]/_components/sharing-tab/components/invite-modal";

type TProps = {
  params: Promise<{ id: string }>;
};

export default async function InterceptedInvitePage({ params }: TProps) {
  const { id } = await params;
  return <InviteModal propertyId={id} />;
}

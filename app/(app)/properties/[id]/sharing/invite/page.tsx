import { InviteModal } from "../../_components/sharing-tab/components/invite-modal";

type TProps = {
  params: Promise<{ id: string }>;
};

export default async function InvitePage({ params }: TProps) {
  const { id } = await params;
  return <InviteModal propertyId={id} />;
}

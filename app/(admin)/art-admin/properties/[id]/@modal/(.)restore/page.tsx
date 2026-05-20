import { notFound } from "next/navigation";

import { DETAIL_MOCK } from "../../_data/mock";
import { RestoreDialogContent } from "../../_components/restore-dialog";

type TProps = {
  params: Promise<{ id: string }>;
};

export default async function InterceptedRestorePage({ params }: TProps) {
  const { id } = await params;
  const property = DETAIL_MOCK[id];

  if (!property || property.status !== "deleted") notFound();

  return (
    <RestoreDialogContent
      propertyName={property.name}
      sharingNames={property.sharing.map((u) => u.name)}
    />
  );
}

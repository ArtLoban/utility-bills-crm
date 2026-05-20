import { notFound } from "next/navigation";

import { DETAIL_MOCK } from "../../_data/mock";
import { HardDeleteDialogContent } from "../../_components/hard-delete-dialog";

type TProps = {
  params: Promise<{ id: string }>;
};

export default async function InterceptedHardDeletePage({ params }: TProps) {
  const { id } = await params;
  const property = DETAIL_MOCK[id];

  if (!property || property.status !== "deleted") notFound();

  return (
    <HardDeleteDialogContent
      propertyName={property.name}
      ownerName={property.owners[0]?.name ?? "the owner"}
      servicesCount={property.servicesCount}
      readingsCount={property.readingsCount}
      billsCount={property.billsCount}
      paymentsCount={property.paymentsCount}
    />
  );
}

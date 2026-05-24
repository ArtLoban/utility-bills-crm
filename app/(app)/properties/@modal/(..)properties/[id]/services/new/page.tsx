import { notFound } from "next/navigation";

import { getPropertyDetail } from "@/app/(app)/properties/[id]/_data/queries";
import { getAddServicePageData } from "@/app/(app)/properties/[id]/services/new/_data/queries";
import { AddServiceModal } from "@/features/services";
import type { PropertyId } from "@/lib/db/schema/properties";

type TProps = {
  params: Promise<{ id: string }>;
};

export default async function InterceptedAddServicePage({ params }: TProps) {
  const { id } = await params;
  const propertyId = id as PropertyId;

  const [propertyResult, dataResult] = await Promise.all([
    getPropertyDetail(propertyId),
    getAddServicePageData(propertyId),
  ]);

  if (!propertyResult.ok || propertyResult.value.role === "viewer") notFound();
  if (!dataResult.ok) notFound();

  return (
    <AddServiceModal
      propertyId={propertyId}
      serviceTypes={dataResult.value.allServiceTypes}
      existingTypeIds={dataResult.value.existingTypeIds}
    />
  );
}

import { getAvailableServiceTypesForMeter } from "@/app/(app)/properties/[id]/meters/_data/queries";
import { AddMeterModal } from "@/app/(app)/properties/[id]/meters/_components/add-meter-modal";
import type { PropertyId } from "@/lib/db/schema/properties";

type TProps = {
  params: Promise<{ id: string }>;
};

export default async function InterceptedAddMeterPage({ params }: TProps) {
  const { id } = await params;
  const availableServiceTypes = await getAvailableServiceTypesForMeter(id as PropertyId);
  return <AddMeterModal propertyId={id} availableServiceTypes={availableServiceTypes} />;
}

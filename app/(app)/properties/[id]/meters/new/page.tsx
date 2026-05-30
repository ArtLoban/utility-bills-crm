import { getAvailableServiceTypesForMeter } from "../_data/queries";
import { AddMeterModal } from "../_components/add-meter-modal";
import type { PropertyId } from "@/lib/db/schema/properties";

type TProps = {
  params: Promise<{ id: string }>;
};

export default async function AddMeterPage({ params }: TProps) {
  const { id } = await params;
  const availableServiceTypes = await getAvailableServiceTypesForMeter(id as PropertyId);
  return <AddMeterModal propertyId={id} availableServiceTypes={availableServiceTypes} />;
}

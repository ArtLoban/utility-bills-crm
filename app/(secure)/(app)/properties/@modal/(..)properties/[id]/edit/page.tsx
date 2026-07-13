import { notFound } from "next/navigation";

import { getPropertyDetail } from "@/app/(secure)/(app)/properties/[id]/_data/queries";
import { PropertyModal } from "@/features/properties";
import type { PropertyId } from "@/lib/db/schema/properties";

type TProps = {
  params: Promise<{ id: string }>;
};

export default async function InterceptedEditPropertyPage({ params }: TProps) {
  const { id } = await params;
  const result = await getPropertyDetail(id as PropertyId);
  if (!result.ok) notFound();

  return <PropertyModal property={result.value} />;
}

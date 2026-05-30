import { notFound } from "next/navigation";

import { getMeterDetail } from "@/app/(app)/properties/[id]/meters/[mid]/_data/queries";
import { ReplaceMeterModal } from "@/app/(app)/properties/[id]/meters/_components/replace-meter-modal";
import type { MeterId } from "@/lib/db/schema/meters";

type TProps = {
  params: Promise<{ id: string; mid: string }>;
};

export default async function InterceptedReplaceMeterPage({ params }: TProps) {
  const { id, mid } = await params;
  const result = await getMeterDetail(mid as MeterId);

  if (!result.ok || result.value.meter.propertyId !== id) notFound();

  return <ReplaceMeterModal meter={result.value.meter} />;
}

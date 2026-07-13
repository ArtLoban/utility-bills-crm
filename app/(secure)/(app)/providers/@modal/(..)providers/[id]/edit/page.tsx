import { notFound } from "next/navigation";

import { ProviderModal } from "@/features/providers";
import { getProviderForEdit } from "@/app/(secure)/(app)/providers/[id]/_data/queries";
import type { ProviderId } from "@/lib/db/schema/providers";

type TProps = {
  params: Promise<{ id: string }>;
};

export default async function InterceptedEditProviderPage({ params }: TProps) {
  const { id } = await params;
  const result = await getProviderForEdit(id as ProviderId);
  if (!result.ok) notFound();

  return <ProviderModal provider={result.value} />;
}

import { notFound } from "next/navigation";

import { auth } from "@/lib/auth";
import { ProviderModal } from "@/features/providers";

export default async function InterceptedNewProviderPage() {
  const session = await auth();
  if (!session) notFound();

  return <ProviderModal />;
}

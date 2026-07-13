import { requireUser } from "@/lib/auth/guards";
import { ProviderModal } from "@/features/providers";

export default async function InterceptedNewProviderPage() {
  await requireUser();

  return <ProviderModal />;
}

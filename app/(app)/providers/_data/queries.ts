import { auth } from "@/lib/auth";
import { providersByUserId } from "@/lib/db/access/providers";
import type { UserId } from "@/lib/db/schema/auth";
import type { TProvider } from "@/lib/db/schema/providers";

export const getProviderList = async (): Promise<TProvider[]> => {
  const session = await auth();
  if (!session?.user.id) return [];

  const userId = session.user.id as UserId;
  return providersByUserId(userId);
};

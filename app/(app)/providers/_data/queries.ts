import { auth } from "@/lib/auth";
import { providersByUserIdWithUsage } from "@/lib/db/access/providers";
import type { TProviderWithUsage } from "@/lib/db/access/providers";
import type { UserId } from "@/lib/db/schema/auth";

export type { TProviderWithUsage };

export const getProviderList = async (): Promise<TProviderWithUsage[]> => {
  const session = await auth();
  if (!session?.user.id) return [];

  const userId = session.user.id as UserId;

  return providersByUserIdWithUsage(userId);
};

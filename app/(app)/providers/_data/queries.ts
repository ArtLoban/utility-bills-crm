import { requireUser } from "@/lib/auth/guards";
import { providersByUserIdWithUsage } from "@/lib/db/access/providers";
import type { TProviderWithUsage } from "@/lib/db/access/providers";

export type { TProviderWithUsage };

export const getProviderList = async (): Promise<TProviderWithUsage[]> => {
  const userId = await requireUser();

  return providersByUserIdWithUsage(userId);
};

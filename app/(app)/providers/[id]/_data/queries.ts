import { requireUser } from "@/lib/auth/guards";
import { providerByIdForUser } from "@/lib/db/access/providers";
import type { ProviderId, TProvider } from "@/lib/db/schema/providers";
import { NotFoundError } from "@/lib/errors";
import type { Result, TAppError } from "@/lib/errors";

export const getProviderForEdit = async (
  providerId: ProviderId,
): Promise<Result<TProvider, TAppError>> => {
  const userId = await requireUser();

  return providerByIdForUser(userId, providerId);
};

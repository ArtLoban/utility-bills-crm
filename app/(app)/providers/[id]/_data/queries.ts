import { notFound } from "next/navigation";

import { auth } from "@/lib/auth";
import { providerByIdForUser } from "@/lib/db/access/providers";
import type { UserId } from "@/lib/db/schema/auth";
import type { ProviderId, TProvider } from "@/lib/db/schema/providers";
import { err } from "@/lib/errors";
import { NotFoundError } from "@/lib/errors";
import type { Result } from "@/lib/errors";

export const getProviderForEdit = async (
  providerId: ProviderId,
): Promise<Result<TProvider, NotFoundError>> => {
  const session = await auth();
  if (!session?.user.id) return err(new NotFoundError("provider", providerId));

  const userId = session.user.id as UserId;
  return providerByIdForUser(userId, providerId);
};

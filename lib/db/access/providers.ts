import { and, eq, isNull } from "drizzle-orm";

import { db } from "@/lib/db/client";
import { providers } from "@/lib/db/schema/providers";
import type { ProviderId, TProvider } from "@/lib/db/schema/providers";
import type { UserId } from "@/lib/db/schema/auth";
import { NotFoundError, err, ok } from "@/lib/errors";
import type { Result } from "@/lib/errors";

// Pure functions: userId is always a parameter. Never read the auth session internally.
// All helpers filter deletedAt IS NULL — soft-deleted providers are invisible.

export const providersByUserId = (userId: UserId): Promise<TProvider[]> =>
  db
    .select()
    .from(providers)
    .where(and(eq(providers.ownerId, userId), isNull(providers.deletedAt)));

export const providerByIdForUser = async (
  userId: UserId,
  providerId: ProviderId,
): Promise<Result<TProvider, NotFoundError>> => {
  const rows = await db
    .select()
    .from(providers)
    .where(
      and(eq(providers.id, providerId), eq(providers.ownerId, userId), isNull(providers.deletedAt)),
    )
    .limit(1);

  // Decision #108: wrong owner and missing row are indistinguishable.
  // Never reveal resource existence to non-owners.
  if (rows.length === 0) return err(new NotFoundError("provider", providerId));
  return ok(rows[0]!);
};

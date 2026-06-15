import { randomBytes } from "node:crypto";
import { and, eq, gt, isNull } from "drizzle-orm";

import { db } from "@/lib/db/client";
import type { UserId } from "@/lib/db/schema/auth";
import { telegramChannels, telegramLinkTokens } from "@/lib/db/schema/notifications";

// One-time link token lifetime. Short by design: the user opens the deep-link right after
// starting linking, so 10 minutes is generous while keeping tokens prunable.
export const LINK_TOKEN_TTL_MS = 10 * 60 * 1000;

// 32 random bytes, base64url-encoded — fits Telegram's 64-char start-payload limit and its
// A-Za-z0-9_- charset without escaping.
const generateToken = (): string => randomBytes(32).toString("base64url");

export type TIssuedLinkToken = {
  token: string;
  expiresAt: Date;
};

// Issues a fresh link token for the user, replacing any prior unconsumed one (one active token
// per user). Consumed tokens are left untouched — a spent record until pruned.
export const issueLinkToken = async (userId: UserId): Promise<TIssuedLinkToken> =>
  db.transaction(async (tx) => {
    await tx
      .delete(telegramLinkTokens)
      .where(and(eq(telegramLinkTokens.userId, userId), isNull(telegramLinkTokens.consumedAt)));

    const token = generateToken();
    const expiresAt = new Date(Date.now() + LINK_TOKEN_TTL_MS);
    await tx.insert(telegramLinkTokens).values({ token, userId, expiresAt });

    return { token, expiresAt };
  });

export type TConsumeStartTokenInput = {
  token: string;
  chatId: number;
  label: string | null;
};

// Binds a sender's chat to the token's user and consumes the token — atomically. Returns false
// for any token that is unknown, expired, or already consumed (the webhook treats all three the
// same: acknowledge, bind nothing). The channel is upserted on the user's 1:1 row, so re-linking
// to a new chat overwrites the old binding and refreshes linkedAt.
export const consumeStartToken = async ({
  token,
  chatId,
  label,
}: TConsumeStartTokenInput): Promise<boolean> =>
  db.transaction(async (tx) => {
    const now = new Date();

    const [live] = await tx
      .select({ id: telegramLinkTokens.id, userId: telegramLinkTokens.userId })
      .from(telegramLinkTokens)
      .where(
        and(
          eq(telegramLinkTokens.token, token),
          isNull(telegramLinkTokens.consumedAt),
          gt(telegramLinkTokens.expiresAt, now),
        ),
      )
      .limit(1);

    if (!live) return false;

    await tx
      .insert(telegramChannels)
      .values({ userId: live.userId, chatId, label, linkedAt: now })
      .onConflictDoUpdate({
        target: telegramChannels.userId,
        set: { chatId, label, linkedAt: now },
      });

    await tx
      .update(telegramLinkTokens)
      .set({ consumedAt: now })
      .where(eq(telegramLinkTokens.id, live.id));

    return true;
  });
